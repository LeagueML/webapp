import React, { useMemo } from "react";
import { CSSProperties } from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/grid.css";
import flattenChildren from "react-keyed-flatten-children";
import {
  DynamicElementProps,
  GridProps,
  StaticElementProps,
} from "./Grid.types";
import { createLayoutState, layoutStaticElements } from "./Grid.layout";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Grid(props: GridProps) {
  // calculate the possible valid children
  const children = useMemo(
    () =>
      flattenChildren(props.children)
        .map((x) => {
          if (!x || !React.isValidElement<DynamicElementProps>(x))
            return undefined;

          // not sure whether further validating the props is needed.
          if (!x.props || !x.props.w || !x.props.h) return undefined;
          return x;
        })
        .filter((x) => x !== undefined),
    [props.children]
  );

  // thanks https://stackoverflow.com/questions/11731072/dividing-an-array-by-filter-function
  function partition<T>(array: T[], isValid: (element: T) => Boolean): T[][] {
    return array.reduce<T[][]>(
      ([pass, fail], elem) =>
        isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
      [[], []]
    );
  }

  // partition children into dynamic and static
  const [staticElements, dynamicElements] = useMemo(
    () =>
      partition(
        children,
        (x) =>
          React.isValidElement<StaticElementProps>(x) &&
          !!x.props.x &&
          !!x.props.y
      ),
    [children]
  );

  const { rows, cols, dynamicLayoutStrategy } = props;

  const initialState = useMemo(
    () => createLayoutState(rows, cols, children),
    [rows, cols, children]
  );

  const staticLayout = useMemo(
    () => layoutStaticElements(staticElements as any, initialState, rows, cols),
    [staticElements, initialState, rows, cols]
  );

  const dynamicLayout = useMemo(
    () =>
      dynamicLayoutStrategy(dynamicElements as any, staticLayout, rows, cols),
    [dynamicElements, staticLayout, rows, cols, dynamicLayoutStrategy]
  );

  const layout = dynamicLayout.layout;

  const gridStyle: CSSProperties = {
    gridTemplateColumns:
      "repeat(" + props.cols + "," + (100 - props.cols) / props.cols + "%)",
    gridAutoRows: 100 / props.cols + "%",
    gap: "1%",
  };

  return (
    <>
      <div className="grid" style={gridStyle}>
        {layout.map((l, i) => (
          <div
            key={`grid-${i}`}
            className={"grid-element" + (l.static ? " static" : "")}
            style={{
              gridColumnStart: 1 + l.startX,
              gridColumnEnd: 1 + l.endX,
              gridRowStart: 1 + l.startY,
              gridRowEnd: 1 + l.endY,
            }}
          >
            {l.element}
          </div>
        ))}
      </div>
    </>
  );
}
