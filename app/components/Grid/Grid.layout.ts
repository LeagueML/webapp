import React from "react";
import { ReactChild } from "react";
import {
  DynamicLayoutIteration,
  LayedOutElement,
  LayoutState,
  StaticElement,
  StaticLayoutIteration,
} from "./Grid.types";

export function createLayoutState(
  maxRows: number | undefined,
  maxCols: number,
  children: readonly ReactChild[]
): LayoutState {
  return {
    rows: [],
    currentCol: 0,
    currentRow: 0,
    layout: new Array(children.length),
  };
}

export function layoutIterate(
  setState: (fn: (state: LayoutState) => LayoutState) => void,
  getState: () => LayoutState,
  maxRows: number | undefined,
  maxCols: number,
  children: readonly ReactChild[],
  staticElement: StaticLayoutIteration | undefined,
  dynamicElement: DynamicLayoutIteration | undefined
) {
  children.forEach((e: ReactChild, i: number) => {
    if (getState().layout[i]) {
      // console.debug(`Skipping Already layed out ${i}`);
      return;
    }
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
      if (staticElement) {
        setState((s) => staticElement(element, i, s, maxRows, maxCols));
      }
    } else {
      if (dynamicElement) {
        setState((s) => dynamicElement(element, i, s, maxRows, maxCols));
      }
    }
  });
}

export function layoutStaticElement(
  element: StaticElement,
  elementIndex: number,
  state: LayoutState,
  maxRows: number | undefined,
  maxCols: number
): LayoutState {
  console.debug(`Laying out static element ${elementIndex}`);
  const rows = [...state.rows].map((r, i) => [...state.rows[i]]);
  const layout = [...state.layout];
  // check for static element going out of bounds
  if (maxRows && element.y + element.h > maxRows) {
    console.warn(
      `rejecting static element @ ${element.x}, ${element.y} because it's too tall`
    );
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
        console.debug(`Detected Overlap at ${element.x + x}, ${element.y + y}`);
      row[x + element.x] = true;
    }
  }

  // element is fully layed out. Export
  layout[elementIndex] = {
    static: true,
    startX: element.x,
    endX: element.x + element.w,
    startY: element.y,
    endY: element.y + element.h,
  };

  return {
    rows: rows,
    currentCol: state.currentCol,
    currentRow: state.currentRow,
    layout: layout,
  };
}
