import {
  LinksFunction,
  MetaFunction,
  useLoaderData,
  json,
  useParams,
} from "remix";
import SummonerQuickInfo from "~/components/SummonerQuickInfo";
import { executeQuery, GraphQLError } from "~/graphql";

const query = `
  query SummonerInfo($platform: Platform!, $name: String!) {
    getSummonerByName(platform: $platform, name: $name) {
      name
      platform
      summonerLevel
      profileIcon {
        url
      }
    }
  }
`;

export let loader = async ({
  params: { platform, summonerName },
}: {
  params: {
    platform: string;
    summonerName: string;
  };
}) => {
  const response = await executeQuery(query, {
    platform: platform,
    name: summonerName,
  });

  return json(response);
};

export const meta: MetaFunction = () => {
  const summoner = { platform: "Platform", name: "Summoner Name" };

  return {
    title: summoner.name + " on " + summoner.platform,
  };
};

export const links: LinksFunction = () => {
  return [];
};

export default function Index() {
  const response = useLoaderData();
  console.log(response);

  if (!response.errors && response.data)
    return (
      <>
        <SummonerQuickInfo summoner={response.data.getSummonerByName} />
      </>
    );
  else {
    return (
      <>
        <ul>
          {response.errors.map((e: GraphQLError) => (
            <li key={e.message}>{e.message}</li>
          ))}
        </ul>
      </>
    );
  }
}
