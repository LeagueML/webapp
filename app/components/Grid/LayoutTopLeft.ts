import { JSXElementConstructor, ReactElement } from "react";
import { checkNoCollision, mark } from "./Grid.layout";
import {
  DynamicElementProps,
  LayedOutElement,
  LayoutState,
} from "./Grid.types";

export const topLeftScanning = (
  element: ReactElement<
    DynamicElementProps,
    string | JSXElementConstructor<any>
  >,
  state: LayoutState,
  maxRows: number | undefined,
  maxCols: number
): LayoutState => {
  const props = element.props;
  if (props.w > maxCols || (maxRows && props.h > maxRows)) {
    console.warn(
      `rejecting dynamic element because it can never fit within the current bounds of the grid`
    );
    return state;
  }

  let currentCol = 0;
  let currentRow = 0;
  const layout = [...state.layout];
  const marked = state.marked.map((x) => [...x]);

  // retry layouting until we either find a spot or reject the element
  while (true) {
    // check whether this element will fit at the end of the current row
    if (currentCol + props.w > maxCols) {
      currentRow++;
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

    const fit = checkNoCollision(state.marked, layedOutElement);
    if (fit) {
      // console.debug(`Comitting Final Layout.`);
      layout.push(layedOutElement);
      mark(marked, layedOutElement);
      break;
    }
    currentCol++;
  }

  // console.debug(`Ending Layout at ${currentCol}, ${currentRow}`);
  return {
    layout,
    marked,
  };
};
