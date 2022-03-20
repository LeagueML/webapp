import { graphql } from "graphql";
import { withHydrateDatetime } from "relay-nextjs/date";
import {
  Environment,
  GraphQLResponse,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";

import makeGraphQLRequest from "./fetchGraphQL";

export function createServerNetwork() {
  return Network.create(async (request, variables) => {
    const results = await makeGraphQLRequest(request.text, variables);

    const data = JSON.parse(
      JSON.stringify(results),
      withHydrateDatetime
    ) as GraphQLResponse;

    return data;
  });
}

export function createServerEnvironment() {
  return new Environment({
    network: createServerNetwork(),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
