import {
  DynamicLayoutIteration,
  LayedOutElement,
  DynamicElement,
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
const topLeftTemplate =
  (forwardOnly: Boolean, compactUpwards: Boolean): DynamicLayoutIteration =>
  (
    element: DynamicElement,
    elementIndex: number,
    state: LayoutState,
    maxRows: number | undefined,
    maxCols: number
  ): LayoutState => {
    if (element.w > maxCols || (maxRows && element.h > maxRows)) {
      console.warn(
        `rejecting dynamic element because it can never fit within the current bounds of the grid`
      );
      return state;
    }

    let currentCol = state.currentCol;
    let currentRow = state.currentRow;
    const rows = [...state.rows].map((r, i) => [...state.rows[i]]);
    const layout = [...state.layout];

    /*console.debug(
      `Beginning Layout ${elementIndex} ${currentCol} ${currentRow}`
    );*/
    // retry layouting until we either find a spot or reject the element
    while (true) {
      // check whether this element will fit at the end of the current row
      if (currentCol + element.w > maxCols) {
        currentRow++;
        currentCol = 0;
      }

      if (maxRows && maxRows < currentRow + element.h) {
        console.warn(`rejecting dynamic element because it's too tall`);
        return state;
      }

      while (rows.length < currentRow + element.h) {
        rows.push(new Array(maxCols));
      }

      let fit = true;
      for (let y = 0; y < element.h; y++) {
        const row = rows[y + currentRow];
        for (let x = 0; x < element.w; x++) {
          if (row[x + currentCol] === true) {
            fit = false;
            break;
          }
        }
        if (!fit) break;
      }
      if (fit) {
        // console.debug(`Found Spot. Doing post-layout work.`);
        const tempCurrentRow = currentRow;
        if (compactUpwards) {
          console.debug(`Compacting upwards at ${currentRow}, ${currentCol}`);
          while (true) {
            currentRow--;
            console.debug(`Checking row ${currentRow}`);
            if (currentRow < 0) {
              console.debug(`Hit floor`);
              currentRow = 0;
              break;
            }
            let stillFit = true;
            const row = rows[currentRow];
            for (let x = 0; x < element.w; x++) {
              if (row[x + currentCol] === true) {
                stillFit = false;
                break;
              }
            }
            if (!stillFit) {
              currentRow++;
              console.debug(`Done compacting. Pushed until ${currentRow}`);
              break;
            }
          }
        }

        /*console.debug(
          `Marking used cells ${currentRow} + ${element.h}, ${currentCol} + ${element.h}`
        );*/
        for (let y = 0; y < element.h; y++) {
          const row = rows[y + currentRow];
          for (let x = 0; x < element.w; x++) {
            row[x + currentCol] = true;
          }
        }
        // console.debug(`Comitting Final Layout.`);
        layout[elementIndex] = {
          static: false,
          startX: currentCol,
          endX: currentCol + element.w,
          startY: currentRow,
          endY: currentRow + element.h,
        };
        if (forwardOnly) {
          currentCol++;
        } else {
          currentCol = 0;
          currentRow = 0;
        }
        currentRow = tempCurrentRow;
        break;
      }
      currentCol++;
    }

    return {
      currentCol,
      currentRow,
      rows,
      layout,
    };
  };

export const topLeftForwardOnly: DynamicLayoutIteration = topLeftTemplate(
  true,
  false
);

export const topLeftScanning: DynamicLayoutIteration = topLeftTemplate(
  false,
  false
);

export const topLeftForwardOnlyCompacting: DynamicLayoutIteration =
  topLeftTemplate(true, true);

/**
 * @deprecated This doesn't really make sense. Scanning layouting should never need to re-compact.
 */
export const topLeftScanningCompacting: DynamicLayoutIteration =
  topLeftTemplate(false, true);
