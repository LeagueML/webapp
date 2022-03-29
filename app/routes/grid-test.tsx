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
        {[...Array(100)].map((_, i) => (
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
