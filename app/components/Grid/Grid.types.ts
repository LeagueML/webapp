import { PropsWithChildren, ReactChild } from "react";

export type GridProps = PropsWithChildren<{
  rows: number | undefined;
  cols: number;
  dynamicLayoutStrategy: DynamicLayoutIteration;
}>;

export type LayedOutElement = {
  static: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type LayoutState = {
  rows: Boolean[][];
  currentCol: number;
  currentRow: number;
  layout: LayedOutElement[];
};

export type StaticElement = ReactChild & {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DynamicElement = ReactChild & {
  w: number;
  h: number;
};

export type StaticLayoutIteration = (
  element: StaticElement,
  elementIndex: number,
  state: LayoutState,
  maxRows: number | undefined,
  maxCols: number
) => LayoutState;

export type DynamicLayoutIteration = (
  element: DynamicElement,
  elementIndex: number,
  state: LayoutState,
  maxRows: number | undefined,
  maxCols: number
) => LayoutState;
