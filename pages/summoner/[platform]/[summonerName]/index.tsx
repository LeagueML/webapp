import { useRouter } from 'next/router'
import { ReactElement } from 'react';
import { gql, useQuery } from 'urql'
import GraphQLError from '@/components/GraphQLError';
import MainLayout from '@/components/MainLayout';
import platforms from 'platforms';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';

const query = gql`
query ($platform: Platform!, $summonerName: String!) {
    getSummonerByName(platform:$platform, name: $summonerName) {
      profileIcon{
        url
      },
      summonerLevel,
      name,
      platform
    }
}
`;



export default function Summoner() {
  function parsePlatform(platform: string | string[] | undefined) : string | undefined {
      if (typeof platform !== 'string') return undefined;
      return platforms.find((p) => p.short.toLowerCase() === platform.toLowerCase())?.api;
  }

  const router = useRouter()
  const { platform, summonerName } = router.query
  const parsedPlatform = parsePlatform(platform);

  const [result, reexecute] = useQuery({ query: query, variables: {
        platform: parsedPlatform, summonerName
    },
    pause: !parsedPlatform
  })

  if (!parsedPlatform)
    return <><DefaultErrorPage statusCode={404} /></>
  
  const { data, fetching, error } = result

  if (fetching) return <>Loading...</>
  if (error) return <><GraphQLError error={error}></GraphQLError></>

  return <>
        <div>
            <Head>
                <title>{summonerName} - {platform}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <p>Summoner Name: {summonerName}</p>
            <p>{JSON.stringify(data)}</p>
        </div>
    </>
}

Summoner.getLayout = function getLayout(page: ReactElement) {
    return (
      <MainLayout>
        {page}
      </MainLayout>
    )
  }