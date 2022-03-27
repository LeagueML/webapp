import React, { useMemo, useState } from "react";
import { CSSProperties } from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/grid.css";
import flattenChildren from "react-keyed-flatten-children";
import {
  DynamicElementProps,
  GridProps,
  LayedOutElement,
  StaticElementProps,
} from "./Grid.types";
import {
  createLayoutState,
  layoutIterate,
  layoutStaticElement,
} from "./Grid.layout";
import { useRenderCount } from "~/utils/useRenderCount";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

/*
export const useContainerDimensions = (myRef: RefObject<HTMLDivElement>) => {
  const getDimensions = () => ({
    width: myRef!.current!.offsetWidth,
    height: myRef!.current!.offsetHeight,
  });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRef]);

  return dimensions;
};*/
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

  const initialState = useMemo(
    () => createLayoutState(props.rows, props.cols, children),
    [props.rows, props.cols, children]
  );

  const staticLayout = useMemo(
    () =>
      staticElements.reduce(
        (p, c) => layoutStaticElement(c as any, p, props.rows, props.cols),
        initialState
      ),
    [staticElements, initialState, props.rows, props.cols]
  );

  /*
  const dynamicLayout = useMemo(
    () =>
      dynamicElements.reduce(
        (p, c) => layoutStaticElement(c as any, p, props.rows, props.cols),
        staticLayout
      ),
    [dynamicElements, staticLayout, props.rows, props.cols]
  );*/

  const layout = staticLayout.layout;

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
