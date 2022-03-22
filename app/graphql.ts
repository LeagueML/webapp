export async function executeQuery<T>(
  query: string,
  variables: any | undefined
): Promise<GraphQLResponse<T>> {
  const request = new Request("https://api.league.ml/", {
    body: JSON.stringify({
      query: query,
      operationName: undefined,
      variables: variables,
    }),
    method: "POST",
  });

  const response = await fetch(request);

  return response.json<GraphQLResponse<T>>();
}

export type SuccessfullGraphQLResponse<T> = {
  data: T;
};

export type ErroredGraphQLResponse = {
  errors: GraphQLError[];
};

export type GraphQLResponse<T> =
  | SuccessfullGraphQLResponse<T>
  | ErroredGraphQLResponse;

export type GraphQLError = {
  message: string;
  locations: { line: number; column: number }[];
  path: (string | number)[];
};
