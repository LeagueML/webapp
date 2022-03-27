import { LinksFunction } from "remix";
import Grid, {
  links as GridLinks,
  topLeftForwardOnly,
  topLeftForwardOnlyCompacting,
  topLeftScanning,
} from "~/components/Grid";
import GridElement from "~/components/GridElement";
import Rand from "rand-seed";

export const links: LinksFunction = () => {
  return [...GridLinks()];
};

export default function GridTest() {
  var myrng = new Rand("Apples");

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Grid dynamicLayoutStrategy={topLeftScanning} cols={100} rows={undefined}>
        <GridElement key="custom-1" x={10} y={50} w={15} h={25}>
          <div
            style={{ backgroundColor: "red", width: "100%", height: "100%" }}
          ></div>
        </GridElement>
        <GridElement key="custom-2" x={10} y={15} w={15} h={20}>
          <div
            style={{ backgroundColor: "green", width: "100%", height: "100%" }}
          ></div>
        </GridElement>
        <GridElement key="custom-3" x={40} y={15} w={35} h={40}>
          <div
            style={{ backgroundColor: "purple", width: "100%", height: "100%" }}
          ></div>
        </GridElement>
        {/*
        <GridElement x={undefined} y={undefined} w={2} h={2}>
          <div
            style={{ backgroundColor: "yellow", width: "100%", height: "100%" }}
          ></div>
        </GridElement>
        <GridElement x={undefined} y={undefined} w={10} h={10}>
          <div
            style={{
              backgroundColor: "cornflowerblue",
              width: "100%",
              height: "100%",
            }}
          ></div>
        </GridElement>*/}
        {[...Array(500)].map((_, i) => (
          <GridElement
            key={"generated-" + i}
            x={undefined}
            y={undefined}
            w={5 + Math.floor(myrng.next() * 35)}
            h={5 + Math.floor(myrng.next() * 25)}
          >
            <div
              key={"generated-div-" + i}
              style={{
                backgroundColor:
                  "hsl(" + Math.floor(myrng.next() * 360) + "deg 100% 50%)",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
                alignItems: "center",
                display: "inline-flex",
              }}
            >
              {i}
            </div>
          </GridElement>
        ))}
      </Grid>
    </div>
  );
}
