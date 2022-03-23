import { ReactElement } from "react";
import {
  CSSProperties,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/grid.css";
import { GridElementProps } from "./GridElement";

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

type GridElement = { props: GridElementProps };

export type GridProps = {
  children: GridElement[];
};

export type StaticGridElement = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DynamicGridElement = {
  w: number;
  h: number;
};

function calculateLayout(
  maxRows: number,
  elements: GridElement[]
): ReactNode[] {
  function buildDiv(
    element: ReactNode,
    x: number,
    y: number,
    w: number,
    h: number
  ): ReactNode {
    const style: CSSProperties = {
      gridRowStart: x,
      gridRowEnd: x + w,
      gridColumnStart: y,
      gridColumnEnd: y + h,
    };

    return (
      <div className="grid-element" style={style}>
        {element}
      </div>
    );
  }

  if (maxRows <= 0) {
    const serverSideStyle: CSSProperties = {
      visibility: "hidden",
      gridRowStart: 0,
      gridRowEnd: 0,
      gridColumnStart: 0,
      gridColumnEnd: 0,
    };
    // server side layout:
    return elements.map((e, i) => (
      <div key={i} className="grid-element" style={serverSideStyle}>
        {e}
      </div>
    ));
  }

  let layedOut: ReactNode[] = [];
  let cols: Boolean[][] = [];

  console.debug(`Beginning Layout ${maxRows}`);

  // first we look for all static elements and lay them out
  elements.forEach((e: GridElement) => {
    if (!e) {
      console.log("Skipping empty layout element");
      return;
    }

    const element = e.props;

    // if static element
    if ("x" in element && "y" in element) {
      while (cols.length <= element.y + element.y) {
        cols.push(new Array(maxRows));
      }

      console.debug(
        `laying out static element ${JSON.stringify(element)} ${cols.length}`
      );
      for (let y = 0; y < element.h; y++) {
        const col = cols[y + element.y];
        for (let x = 0; x < element.w; x++) {
          console.debug(
            `checking ${element.x + x}, ${element.y + y} (${col.length})`
          );
          if (col[x + element.x] === true)
            console.debug(
              `Detected Overlap at ${element.x + x}, ${element.y + y}`
            );
          col[x + element.x] = true;
        }
      }

      // element is fully layed out. Export
      layedOut.push(
        buildDiv(element, element.x, element.y, element.w, element.h)
      );
    }
  });

  elements.forEach((e: GridElement) => {
    if (!e) {
      console.log("Skipping empty layout element");
      return;
    }

    const element = e.props;

    // if static element
    if ("x" in element) {
      return;
    }

    // layout dynamic element
    console.error("Found dynamic element!");
  });

  return layedOut;
}

export default function Grid(props: GridProps) {
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { width, height } = useContainerDimensions(componentRef);
  const [rows, setRows] = useState(0);
  useEffect(() => {
    setRows(Math.floor(width / 60));
  }, [width]);

  const layout: ReactNode[] = useMemo(() => {
    if (!props.children) return [];
    return calculateLayout(rows, props.children);
  }, [rows, props.children]);

  return (
    <div className="grid" ref={componentRef}>
      H: {width}, W: {height}
      <br />
      R: {rows}
      <hr />
      {layout}
    </div>
  );
}
