import { ReactElement, JSXElementConstructor } from "react";
import {
  ChildType,
  LayedOutElement,
  LayoutState,
  StaticElementProps,
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

export function checkCollision(
  elements: readonly LayedOutElement[],
  toCheck: LayedOutElement
): Boolean {
  return elements.some(
    (element) =>
      element.startX <= toCheck.endX &&
      element.endX >= toCheck.startX &&
      element.startY <= toCheck.endY &&
      element.endY >= toCheck.startY
  );
}
