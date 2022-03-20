import { useRouter } from "next/router";
import platforms from "platforms";
import Head from "next/head";
import SummonerQuickInfo from "@/components/SummonerQuickInfo";
import { graphql } from "relay-runtime";
import { RelayProps, withRelay } from "relay-nextjs";
import { usePreloadedQuery } from "react-relay";
import { LoadingCard } from "@league.ml/component-library";
import { createServerEnvironment, getClientEnvironment } from "relay-stuff";
import type { SummonerNameQuery } from "relay-stuff/__generated__/SummonerNameQuery.graphql";

const PageQuery = graphql`
  query SummonerNameQuery($platform: Platform!, $summonerName: String!) {
    getSummonerByName(platform: $platform, name: $summonerName) {
      name
      platform
      ...SummonerQuickInfo
    }
  }
`;

function Summoner({ preloadedQuery }: RelayProps<{}, SummonerNameQuery>) {
  function parsePlatform(
    platform: string | string[] | undefined
  ): string | undefined {
    if (typeof platform !== "string") return undefined;
    return platforms.find(
      (p) => p.short.toLowerCase() === platform.toLowerCase()
    )?.api;
  }

  const router = useRouter();
  // const { platform, summonerName } = router.query;
  // const parsedPlatform = parsePlatform(platform);

  const query = usePreloadedQuery(PageQuery, preloadedQuery);
  const title =
    query.getSummonerByName?.name + " - " + query.getSummonerByName?.platform ??
    "Loading";

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SummonerQuickInfo summoner={query.getSummonerByName!} />
      </div>
    </>
  );
}

export default withRelay(Summoner, PageQuery, {
  fallback: <LoadingCard />,
  createClientEnvironment: () => getClientEnvironment()!,
  serverSideProps: async (ctx) => {
    return {};
  },
  createServerEnvironment: async (ctx) => createServerEnvironment(),
});
