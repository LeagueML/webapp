import React, { memo } from "react";
import { CSSProperties } from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/grid.css";
import flattenChildren from "react-keyed-flatten-children";
import {
  DynamicElementProps,
  GridProps,
  LayoutKind,
  StaticElementProps,
} from "./Grid.types";
import { layoutStaticElements } from "./Grid.layout";
import { getPlaceholders, topLeftScanning } from "./LayoutTopLeft";
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

function Grid(props: GridProps) {
  // calculate the possible valid children
  const children = flattenChildren(props.children)
    .map((x) => {
      if (!x || !React.isValidElement<DynamicElementProps>(x)) return undefined;

      // not sure whether further validating the props is needed.
      if (!x.props || !x.props.w || !x.props.h) return undefined;
      return x;
    })
    .filter((x) => x !== undefined);

  // thanks https://stackoverflow.com/questions/11731072/dividing-an-array-by-filter-function
  function partition<T>(array: T[], isValid: (element: T) => Boolean): T[][] {
    return array.reduce<T[][]>(
      ([pass, fail], elem) =>
        isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
      [[], []]
    );
  }

  // partition children into dynamic and static
  const [staticElements, dynamicElements] = partition(
    children,
    (x) =>
      React.isValidElement<StaticElementProps>(x) && !!x.props.x && !!x.props.y
  );

  const { rows, cols } = props;

  const staticLayout = layoutStaticElements(staticElements as any, rows, cols);

  const dynamicLayout = topLeftScanning(
    dynamicElements as any,
    staticLayout,
    rows,
    cols
  );

  const placeholders = getPlaceholders(dynamicLayout.marked);

  const layout = dynamicLayout.layout;

  const gridStyle: CSSProperties = {
    gridTemplateColumns:
      "repeat(" + props.cols + "," + (100 - props.cols) / props.cols + "%)",
    gridAutoRows: (100 - props.cols) / props.cols + "%",
    gap: "1%",
  };

  return (
    <>
      <div className="grid" style={gridStyle}>
        {layout.map((l, i) => (
          <div
            key={`grid-${i}`}
            className={
              "grid-element" + (l.kind === LayoutKind.Static ? " static" : "")
            }
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
        {placeholders.map((l, i) => (
          <div
            key={`placeholder-${i}`}
            className={"grid-element placeholder"}
            style={{
              gridColumnStart: 1 + l.startX,
              gridColumnEnd: 1 + l.endX,
              gridRowStart: 1 + l.startY,
              gridRowEnd: 1 + l.endY,
            }}
          ></div>
        ))}
      </div>
    </>
  );
}

//export default memo(Grid);
export default Grid;
