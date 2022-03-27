import React, { ReactElement, JSXElementConstructor } from "react";
import { ReactChild } from "react";
import {
  ChildType,
  DynamicLayoutIteration,
  LayoutState,
  StaticElementProps,
  StaticLayoutIteration,
} from "./Grid.types";

export function createLayoutState(
  maxRows: number | undefined,
  maxCols: number,
  children: readonly ChildType[]
): LayoutState {
  return {
    currentCol: 0,
    currentRow: 0,
    layout: [],
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
  element: ReactElement<
    StaticElementProps,
    string | JSXElementConstructor<any>
  >,
  state: LayoutState,
  maxRows: number | undefined,
  maxCols: number
): LayoutState {
  const props = element.props;
  const layout = [...state.layout];
  // check for static element going out of bounds
  if (maxRows && props.y + props.h > maxRows) {
    console.warn(
      `rejecting static element @ ${props.x}, ${props.y} because it's too tall`
    );
  }

  if (props.x + props.w > maxCols) {
    console.warn(
      `rejecting static element @ ${props.x}, ${props.y} because it's too wide`
    );
  }

  // element is fully layed out. Export
  layout.push({
    element: element,
    static: true,
    startX: props.x,
    endX: props.x + props.w,
    startY: props.y,
    endY: props.y + props.h,
  });

  return {
    currentCol: state.currentCol,
    currentRow: state.currentRow,
    layout: layout,
  };
}
