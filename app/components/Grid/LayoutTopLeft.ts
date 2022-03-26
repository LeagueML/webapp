import React from "react";
import { ReactChild } from "react";
import { DynamicLayout, LayedOutElement } from "./Grid.types";

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
  (forwardOnly: Boolean, compactUpwards: Boolean): DynamicLayout =>
  (
    children: readonly ReactChild[],
    maxCols: number,
    maxRows: number | undefined,
    rows: Boolean[][],
    layedOut: LayedOutElement[]
  ) => {
    let totalCompacted = 0;
    let currentRow = 0;
    let currentCol = 0;
    // next layout all dynamic children
    children.forEach((e: ReactChild, i: number) => {
      if (!React.isValidElement(e)) return;

      if (!e) {
        console.log("Skipping empty layout element");
        return;
      }

      const elementa = e.props;

      if (!("h" in elementa && elementa.h && "w" in elementa && elementa.w)) {
        throw new Error("skipping invalid child. No width or height.");
      }

      // if static element
      if ("x" in elementa && elementa.x && "y" in elementa && elementa.y) {
        return;
      }

      const element: { w: number; h: number } = elementa;

      if (element.w > maxCols || (maxRows && element.h > maxRows)) {
        console.warn(
          `rejecting dynamic element because it can never fit within the current bounds of the grid`
        );
        return;
      }

      console.debug(`Beginning Layout ${i}`);
      // retry layouting until we either find a spot or reject the element
      while (true) {
        // check whether this element will fit at the end of the current row
        if (currentCol + element.w > maxCols) {
          currentRow++;
          currentCol = 0;
        }

        if (maxRows && maxRows < currentRow + element.h) {
          console.warn(`rejecting dynamic element because it's too tall`);
          return;
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
          console.debug(`Found Spot. Doing post-layout work.`);
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

          console.debug(
            `Marking used cells ${currentRow} + ${element.h}, ${currentCol} + ${element.h}`
          );
          for (let y = 0; y < element.h; y++) {
            const row = rows[y + currentRow];
            for (let x = 0; x < element.w; x++) {
              row[x + currentCol] = true;
            }
          }
          console.debug(`Comitting Final Layout.`);
          layedOut.push({
            static: false,
            index: i,
            startX: currentCol,
            endX: currentCol + element.w,
            startY: currentRow,
            endY: currentRow + element.h,
          });
          if (forwardOnly) {
            currentCol++;
          } else {
            currentCol = 0;
            currentRow = 0;
          }
          totalCompacted += tempCurrentRow - currentRow;
          currentRow = tempCurrentRow;
          break;
        }
        currentCol++;
      }
    });
    console.debug(`Compacted ${totalCompacted} rows`);
  };

export const topLeftForwardOnly: DynamicLayout = topLeftTemplate(true, false);

export const topLeftScanning: DynamicLayout = topLeftTemplate(false, false);

export const topLeftForwardOnlyCompacting: DynamicLayout = topLeftTemplate(
  true,
  true
);

/**
 * @deprecated This doesn't really make sense. Scanning layouting should never need to re-compact.
 */
export const topLeftScanningCompacting: DynamicLayout = topLeftTemplate(
  false,
  true
);
