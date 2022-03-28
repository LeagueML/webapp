import { JSXElementConstructor, ReactElement } from "react";
import { checkCollision, mark } from "./Grid.layout";
import {
  DynamicElementProps,
  DynamicLayoutIteration,
  LayedOutElement,
  LayoutState,
} from "./Grid.types";

/* DESCRIPTION:
 * This is a super basic layout made for initial testing
 * It's not very optimized so you'll likely gain nothing from using this,
 * but it's kept for reference
 * It just goes left to right, then top to bottom and tries to fit the current element anywhere
 * The two options are forwardOnly, which controls whether the counters are reset after every layout,
 * which causes a very good linear layout, where little to no space at the top is left,
 * but which has poor priority retention.
 * The compactUpwards flag controls whether the algorithm tries to push each component upwards,
 * which can help a tiny bit with compaction, especially around static elements.
 */
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

    const fit = !checkCollision(state.marked, layedOutElement);
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
