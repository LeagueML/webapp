import { Platform } from "~/sharedTypes";

export type SummonerInfo = {
  name: string;
  level: number;
  platform: Platform;
  profileIcon: {
    url: string;
  };
};

export type SummonerQuickInfoProps = {
  summoner: SummonerInfo;
};

export default function SummonerQuickInfo({
  summoner,
}: SummonerQuickInfoProps) {
  return (
    <>
      <div>
        <p>Summoner Name: {summoner.name}</p>
        <p>{JSON.stringify(summoner)}</p>
      </div>
    </>
  );
}
