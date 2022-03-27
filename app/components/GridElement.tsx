import { memo, PropsWithChildren } from "react";

function Element(
  props: PropsWithChildren<{
    x: number | undefined;
    y: number | undefined;
    w: number;
    h: number;
  }>
) {
  return <>{props.children}</>;
}

export default memo(Element);
