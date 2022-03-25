import React from "react";
import { ReactChild } from "react";
import { DynamicLayout, LayedOutElement } from "./Grid.types";

const dynamicLayoutBasicTopLeftTemplate =
  (forwardOnly: Boolean): DynamicLayout =>
  (
    children: readonly ReactChild[],
    maxCols: number,
    maxRows: number | undefined,
    rows: Boolean[][],
    layedOut: LayedOutElement[]
  ) => {
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
          for (let y = 0; y < element.h; y++) {
            const row = rows[y + currentRow];
            for (let x = 0; x < element.w; x++) {
              row[x + currentCol] = true;
            }
          }
          break;
        }
        currentCol++;
      }

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
    });
  };

export const dynamicLayoutBasicTopLeftForwardOnly: DynamicLayout =
  dynamicLayoutBasicTopLeftTemplate(true);

export const dynamicLayoutBasicTopLeftScanning: DynamicLayout =
  dynamicLayoutBasicTopLeftTemplate(false);
