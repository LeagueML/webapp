import { LinksFunction } from "remix";
import Grid, { links as GridLinks } from "~/components/Grid";
import GridElement from "~/components/GridElement";

export const links: LinksFunction = () => {
  return [...GridLinks()];
};

export default function GridTest() {
  return (
    <Grid>
      <GridElement x={1} y={1} w={5} h={3}>
        <div style={{ backgroundColor: "red" }}></div>
      </GridElement>
      <GridElement x={1} y={8} w={2} h={8}>
        <div style={{ backgroundColor: "green" }}></div>
      </GridElement>
    </Grid>
  );
}
