import { LinksFunction } from "remix";
import Grid, { links as GridLinks } from "~/components/Grid";
import GridElement from "~/components/GridElement";
import Rand from "rand-seed";
import BreakpointContainer, {
  links as BreakpointContainerLinks,
} from "~/components/BreakpointContainer";

export const links: LinksFunction = () => {
  return [...GridLinks(), ...BreakpointContainerLinks()];
};

export default function GridTest() {
  var myrng = new Rand("Apples");

  return (
    <BreakpointContainer>
      <Grid cols={25} rows={undefined}>
        <GridElement key="custom-1" x={2} y={12} w={4} h={6}>
          <div
            style={{ backgroundColor: "red", width: "100%", height: "100%" }}
          ></div>
        </GridElement>
        <GridElement key="custom-2" x={2} y={4} w={4} h={5}>
          <div
            style={{ backgroundColor: "green", width: "100%", height: "100%" }}
          ></div>
        </GridElement>
        <GridElement key="custom-3" x={10} y={4} w={9} h={10}>
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
            w={1 + Math.floor(myrng.next() * 5)}
            h={1 + Math.floor(myrng.next() * 3)}
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
    </BreakpointContainer>
  );
}
