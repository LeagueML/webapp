import { PropsWithChildren } from "react";

export default function Element(
  props: PropsWithChildren<{
    x: number | undefined;
    y: number | undefined;
    w: number;
    h: number;
  }>
) {
  return <>{props.children}</>;
}
