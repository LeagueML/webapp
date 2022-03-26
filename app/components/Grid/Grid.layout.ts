import React from "react";
import { ReactChild } from "react";
import { DynamicLayout } from ".";
import { LayedOutElement } from "./Grid.types";

export function calculateLayout(
  layout: DynamicLayout,
  maxRows: number | undefined,
  maxCols: number,
  children: readonly ReactChild[]
): LayedOutElement[] {
  let layedOut: LayedOutElement[] = new Array(children.length);
  let rows: Boolean[][] = [];

  const start = Date.now();

  console.debug(`Beginning Layout ${maxCols}`);

  // first we look for all static elements and lay them out
  children.forEach((e: ReactChild, i: number) => {
    if (!React.isValidElement(e)) return;

    if (!e) {
      console.log("Skipping empty layout element");
      return;
    }

    const element = e.props;

    if (!("h" in element && "w" in element)) {
      throw new Error("skipping invalid child. No width or height.");
    }

    // if static element
    if ("x" in element && element.x && "y" in element && element.y) {
      // check for static element going out of bounds
      if (maxRows && element.y + element.h > maxRows) {
        console.warn(
          `rejecting static element @ ${element.x}, ${element.y} because it's too tall`
        );
        return;
      }

      // lengthen work area to fit child
      while (rows.length < element.y + element.h) {
        rows.push(new Array(maxCols));
      }

      // set used fields to true
      for (let y = 0; y < element.h; y++) {
        const row = rows[y + element.y];
        for (let x = 0; x < element.w; x++) {
          if (row[x + element.x] === true)
            console.debug(
              `Detected Overlap at ${element.x + x}, ${element.y + y}`
            );
          row[x + element.x] = true;
        }
      }

      // element is fully layed out. Export
      layedOut[i] = {
        static: true,
        index: i,
        startX: element.x,
        endX: element.x + element.w,
        startY: element.y,
        endY: element.y + element.h,
      };
    }
  });

  layout(children, maxCols, maxRows, rows, layedOut);

  const end = Date.now();
  console.log(
    `Done layout. ${layedOut.length} committed. Took ${end - start}ms`
  );
  return layedOut;
}
