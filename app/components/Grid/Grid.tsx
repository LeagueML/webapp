import React from "react";
import { CSSProperties } from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/grid.css";
import flattenChildren from "react-keyed-flatten-children";
import { GridProps, LayedOutElement } from "./Grid.types";
import { calculateLayout } from "./Grid.layout";
import { dynamicLayoutBasicTopLeftForwardOnly } from "./DynamicLayoutTopLeft";

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
  let layout: LayedOutElement[];
  if (!props.children) return <div className="grid"></div>;
  const children = flattenChildren(props.children);

  layout = calculateLayout(
    dynamicLayoutBasicTopLeftForwardOnly,
    props.rows,
    props.cols,
    children
  );
  console.log(JSON.stringify(layout));

  const gridStyle: CSSProperties = {
    gridTemplateColumns:
      "repeat(" + props.cols + "," + (100 - props.cols) / props.cols + "%)",
    gridAutoRows: 100 / props.cols + "%",
    gap: "1%",
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
