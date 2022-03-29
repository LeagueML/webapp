import { ReactElement, JSXElementConstructor } from "react";
import {
  LayedOutElement,
  LayoutKind,
  LayoutState,
  StaticElementProps,
} from "./Grid.types";

export function layoutStaticElements(
  elements: ReactElement<
    StaticElementProps,
    string | JSXElementConstructor<any>
  >[],
  maxRows: number | undefined,
  maxCols: number
): LayoutState {
  const layout: LayedOutElement[] = [];

  elements.forEach((element) => {
    const props = element.props;
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
    const e = {
      element: element,
      kind: LayoutKind.Static,
      startX: props.x,
      endX: props.x + props.w,
      startY: props.y,
      endY: props.y + props.h,
    };
    layout.push(e);
  });

  return {
    layout,
  };
}

export function checkNoCollision(
  marked: Boolean[][],
  toCheck: LayedOutElement
): Boolean {
  for (let y = toCheck.startY; y < toCheck.endY; y++) {
    if (marked.length <= y) continue;
    const temp = marked[y];
    for (let x = toCheck.startX; x < toCheck.endX; x++) {
      if (temp[x]) return false;
    }
  }
  return true;
}

export function mark(marked: Boolean[][], element: LayedOutElement) {
  for (let y = element.startY; y < element.endY; y++) {
    while (marked.length <= y) {
      marked.push(new Array(marked[0].length));
    }
    const temp = marked[y];
    for (let x = element.startX; x < element.endX; x++) {
      temp[x] = true;
    }
  }
}
