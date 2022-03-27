import React, { useMemo, useState } from "react";
import { CSSProperties } from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/grid.css";
import flattenChildren from "react-keyed-flatten-children";
import { GridProps, LayedOutElement } from "./Grid.types";
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
  const renderCount = useRenderCount();
  console.log(renderCount);
  const children = useMemo(
    () => flattenChildren(props.children),
    [props.children]
  );
  const [layoutState, setLayoutState] = useState(() =>
    createLayoutState(props.rows, props.cols, children)
  );
  const getState = () => layoutState;

  layoutIterate(
    setLayoutState,
    getState,
    props.rows,
    props.cols,
    children,
    layoutStaticElement,
    undefined
  );
  console.debug(
    `Finished static element layout ${layoutState.currentCol}, ${layoutState.currentRow}`
  );

  layoutIterate(
    setLayoutState,
    getState,
    props.rows,
    props.cols,
    children,
    undefined,
    props.dynamicLayoutStrategy
  );
  console.debug(
    `Finished static element layout ${layoutState.currentCol}, ${layoutState.currentRow}`
  );

  const gridStyle: CSSProperties = {
    gridTemplateColumns:
      "repeat(" + props.cols + "," + (100 - props.cols) / props.cols + "%)",
    gridAutoRows: 100 / props.cols + "%",
    gap: "1%",
  };

  return (
    <>
      <div className="grid" style={gridStyle}>
        {getState().layout.map((l, i) => {
          if (l) {
            return (
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
                {children[i]}
              </div>
            );
          } else {
            return (
              <div key={`grid-${i}`} className="grid-element loading">
                {children[i]}
              </div>
            );
          }
        })}
      </div>
    </>
  );
}
