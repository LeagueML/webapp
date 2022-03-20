import { Variables } from "react-relay";
import { GraphQLResponse } from "relay-runtime";

async function fetchGraphQL(
  text: string | null | undefined,
  variables: Variables
): Promise<GraphQLResponse> {
  return fetch("https://api.league.ml/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  }).then((res) => res.json());
}

export default fetchGraphQL;
