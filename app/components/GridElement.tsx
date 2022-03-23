import { PropsWithChildren } from "react";
import { DynamicGridElement, StaticGridElement } from "./Grid";

export type GridElementProps = StaticGridElement | DynamicGridElement;

export default function Element(props: PropsWithChildren<GridElementProps>) {
  return <>{props.children}</>;
}
