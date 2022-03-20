import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { SummonerQuickInfo$key } from "relay-stuff/__generated__/SummonerQuickInfo.graphql";

const fragment = graphql`
  fragment SummonerQuickInfo on Summoner {
    name
    summonerLevel
    platform
  }
`;

export type SummonerQuickInfoProps = {
  summoner: SummonerQuickInfo$key;
};

export default function SummonerQuickInfo({
  summoner,
}: SummonerQuickInfoProps) {
  const data = useFragment(fragment, summoner);

  return (
    <>
      <div>
        <p>Summoner Name: {data.name}</p>
        <p>{JSON.stringify(data)}</p>
      </div>
    </>
  );
}
