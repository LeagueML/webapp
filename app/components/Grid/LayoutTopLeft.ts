import { JSXElementConstructor, ReactElement } from "react";
import { checkNoCollision, mark } from "./Grid.layout";
import {
  DynamicElementProps,
  LayedOutElement,
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
): LayoutState => {
  const layout = [...state.layout];
  const marked = state.marked.map((x) => [...x]);
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
        currentCol = 0;
      }

      if (maxRows && maxRows < currentRow + props.h) {
        console.warn(`rejecting dynamic element because it's too tall`);
        return state;
      }

      const layedOutElement: LayedOutElement = {
        element: element,
        static: false,
        startX: currentCol,
        endX: currentCol + props.w,
        startY: currentRow,
        endY: currentRow + props.h,
      };

      const fit = checkNoCollision(marked, layedOutElement);
      if (fit) {
        // console.debug(`Comitting Final Layout.`);
        layout.push(layedOutElement);
        mark(marked, layedOutElement);
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
