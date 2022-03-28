import { PropsWithChildren, JSXElementConstructor, ReactElement } from "react";

export type GridProps = PropsWithChildren<{
  rows: number | undefined;
  cols: number;
  dynamicLayoutStrategy: DynamicLayout;
}>;

export type LayedOutElement = {
  element: ReactElement<any, string | JSXElementConstructor<any>>;
  static: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type LayoutState = {
  layout: LayedOutElement[];
};

export type StaticElementProps = DynamicElementProps & {
  x: number;
  y: number;
};

export type DynamicElementProps = {
  w: number;
  h: number;
};

export type ChildType =
  | ReactElement<DynamicElementProps, string | JSXElementConstructor<any>>
  | undefined;

export type DynamicLayout = (
  elements: React.ReactElement<
    DynamicElementProps,
    string | React.JSXElementConstructor<any>
  >[],
  state: LayoutState,
  maxRows: number | undefined,
  maxCols: number
) => LayoutState;
