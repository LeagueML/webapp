import { PropsWithChildren, ReactChild } from "react";

export type GridProps = PropsWithChildren<{
  rows: number | undefined;
  cols: number;
}>;

export type LayedOutElement = {
  index: number;
  static: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type DynamicLayout = (
  children: readonly ReactChild[],
  maxCols: number,
  maxRows: number | undefined,
  rows: Boolean[][],
  layedOut: LayedOutElement[]
) => void;
