import { PropsWithChildren, JSXElementConstructor, ReactElement } from "react";

export type GridProps = PropsWithChildren<{
  rows: number | undefined;
  cols: number;
}>;

export enum LayoutKind {
  Static,
  Placeholder,
  Dynamic,
}

export type LayedOutElement = {
  element: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
  kind: LayoutKind;
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
