import React, { ReactChild } from "react";
import {
  CSSProperties,
  PropsWithChildren,
  RefObject,
  useEffect,
  useState,
} from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/grid.css";
import flattenChildren from "react-keyed-flatten-children";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

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
};

export type GridProps = PropsWithChildren<{
  rows: number | undefined;
  cols: number;
}>;

type LayedOutElement = {
  index: number;
  static: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

function calculateLayout(
  maxRows: number | undefined,
  maxCols: number,
  children: readonly ReactChild[]
): LayedOutElement[] {
  let layedOut: LayedOutElement[] = [];
  let rows: Boolean[][] = [];

  const start = Date.now();

  console.debug(`Beginning Layout ${maxCols}`);

  // first we look for all static elements and lay them out
  children.forEach((e: ReactChild, i: number) => {
    if (!React.isValidElement(e)) return;

    if (!e) {
      console.log("Skipping empty layout element");
      return;
    }

    const element = e.props;

    if (!("h" in element && "w" in element)) {
      throw new Error("skipping invalid child. No width or height.");
    }

    // if static element
    if ("x" in element && element.x && "y" in element && element.y) {
      // check for static element going out of bounds
      if (maxRows && element.y + element.h > maxRows) {
        console.warn(
          `rejecting static element @ ${element.x}, ${element.y} because it's too tall`
        );
        return;
      }

      // lengthen work area to fit child
      while (rows.length < element.y + element.h) {
        rows.push(new Array(maxCols));
      }

      // set used fields to true
      for (let y = 0; y < element.h; y++) {
        const row = rows[y + element.y];
        for (let x = 0; x < element.w; x++) {
          if (row[x + element.x] === true)
            console.debug(
              `Detected Overlap at ${element.x + x}, ${element.y + y}`
            );
          row[x + element.x] = true;
        }
      }

      // element is fully layed out. Export
      layedOut.push({
        static: true,
        index: i,
        startX: element.x,
        endX: element.x + element.w,
        startY: element.y,
        endY: element.y + element.h,
      });
    }
  });

  let currentRow = 0;
  let currentCol = 0;
  // next layout all dynamic children
  children.forEach((e: ReactChild, i: number) => {
    if (!React.isValidElement(e)) return;

    if (!e) {
      console.log("Skipping empty layout element");
      return;
    }

    const elementa = e.props;

    if (!("h" in elementa && elementa.h && "w" in elementa && elementa.w)) {
      throw new Error("skipping invalid child. No width or height.");
    }

    // if static element
    if ("x" in elementa && elementa.x && "y" in elementa && elementa.y) {
      return;
    }

    const element: { w: number; h: number } = elementa;

    if (element.w > maxCols || (maxRows && element.h > maxRows)) {
      console.warn(
        `rejecting dynamic element because it can never fit within the current bounds of the grid`
      );
      return;
    }

    // retry layouting until we either find a spot or reject the element
    while (true) {
      // check whether this element will fit at the end of the current row
      if (currentCol + element.w > maxCols) {
        currentRow++;
        currentCol = 0;
      }

      if (maxRows && maxRows < currentRow + element.h) {
        console.warn(`rejecting dynamic element because it's too tall`);
        return;
      }

      while (rows.length < currentRow + element.h) {
        rows.push(new Array(maxCols));
      }

      let fit = true;
      for (let y = 0; y < element.h; y++) {
        const row = rows[y + currentRow];
        for (let x = 0; x < element.w; x++) {
          if (row[x + currentCol] === true) {
            fit = false;
            break;
          }
        }
        if (!fit) break;
      }
      if (fit) {
        for (let y = 0; y < element.h; y++) {
          const row = rows[y + currentRow];
          for (let x = 0; x < element.w; x++) {
            row[x + currentCol] = true;
          }
        }
        break;
      }
      currentCol++;
    }

    layedOut.push({
      static: false,
      index: i,
      startX: currentCol,
      endX: currentCol + element.w,
      startY: currentRow,
      endY: currentRow + element.h,
    });
    currentCol++;
  });

  const end = Date.now();
  console.log(
    `Done layout. ${layedOut.length} committed. Took ${end - start}ms`
  );
  return layedOut;
}

export default function Grid(props: GridProps) {
  let layout: LayedOutElement[];
  if (!props.children) return <div className="grid"></div>;
  const children = flattenChildren(props.children);

  layout = calculateLayout(props.rows, props.cols, children);
  console.log(JSON.stringify(layout));

  const gridStyle: CSSProperties = {
    gridTemplateColumns: "repeat(" + props.cols + "," + 100 / props.cols + "%)",
    gridAutoRows: 100 / props.cols + "%",
    //grid-template-rows: 50px;
    //grid-template-columns: 50px;
    //gap: 10px;
  };

  return (
    <>
      <div className="grid" style={gridStyle}>
        {layout.map((l) => (
          <div
            key={`${l.startX}/${l.endX}-${l.startY}/${l.endY}`}
            className={"grid-element" + (l.static ? " static" : "")}
            style={{
              gridColumnStart: 1 + l.startX,
              gridColumnEnd: 1 + l.endX,
              gridRowStart: 1 + l.startY,
              gridRowEnd: 1 + l.endY,
            }}
          >
            {children[l.index]}
          </div>
        ))}
      </div>
    </>
  );
}
