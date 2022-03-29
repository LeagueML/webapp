import { JSXElementConstructor, ReactElement } from "react";
import { checkNoCollision, mark } from "./Grid.layout";
import {
  DynamicElementProps,
  LayedOutElement,
  LayoutKind,
  LayoutState,
} from "./Grid.types";

const lookbehindWindow = 30;
export const topLeftScanning = (
  elements: ReactElement<
    DynamicElementProps,
    string | JSXElementConstructor<any>
  >[],
  state: LayoutState,
  maxRows: number | undefined,
  maxCols: number
): LayoutState & { marked: Boolean[][] } => {
  const layout = [...state.layout];
  const marked: Boolean[][] = Array.from(
    { length: maxCols },
    (_e, _i) => new Array(maxCols)
  );

  layout.forEach((e) => mark(marked as any, e));

  let startRow = 0;

  elements.forEach((element) => {
    const props = element.props;
    if (props.w > maxCols || (maxRows && props.h > maxRows)) {
      console.warn(
        `rejecting dynamic element because it can never fit within the current bounds of the grid`
      );
      return state;
    }

    let currentCol = 0;
    let currentRow = startRow;

    // retry layouting until we either find a spot or reject the element
    while (true) {
      // check whether this element will fit at the end of the current row
      if (currentCol + props.w > maxCols) {
        currentRow++;
        startRow = Math.max(startRow, currentRow - lookbehindWindow);
        // TODO: Throw away unused row again (if startRow > 1 -> marked[startRow - 1] unused)
        currentCol = 0;
      }

      if (maxRows && maxRows < currentRow + props.h) {
        console.warn(`rejecting dynamic element because it's too tall`);
        return state;
      }

      const layedOutElement: LayedOutElement = {
        element: element,
        kind: LayoutKind.Dynamic,
        startX: currentCol,
        endX: currentCol + props.w,
        startY: currentRow,
        endY: currentRow + props.h,
      };

      const fit = checkNoCollision(marked as any, layedOutElement);
      if (fit) {
        // console.debug(`Comitting Final Layout.`);
        layout.push(layedOutElement);
        mark(marked as any, layedOutElement);
        break;
      }
      currentCol++;
    }
  });

  // console.debug(`Ending Layout at ${currentCol}, ${currentRow}`);
  return {
    layout,
    marked,
  };
};

export function getPlaceholders(marked: Boolean[][]): LayedOutElement[] {
  const layout = [];
  for (let y = 0; y < marked.length; y++) {
    const temp = marked[y];
    for (let x = 0; x < temp.length; x++) {
      if (!temp[x]) {
        layout.push({
          element: undefined,
          kind: LayoutKind.Placeholder,
          startX: x,
          endX: x + 1,
          startY: y,
          endY: y + 1,
        });
      }
    }
  }
  return layout;
}
