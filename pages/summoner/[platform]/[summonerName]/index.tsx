import { useRouter } from 'next/router'
import { ReactElement } from 'react';
import MainLayout from '@/components/MainLayout';
import platforms from 'platforms';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import SummonerQuickInfo from '@/components/SummonerQuickInfo';

export default function Summoner() {
  function parsePlatform(platform: string | string[] | undefined) : string | undefined {
      if (typeof platform !== 'string') return undefined;
      return platforms.find((p) => p.short.toLowerCase() === platform.toLowerCase())?.api;
  }

  const router = useRouter()
  const { platform, summonerName } = router.query
  const parsedPlatform = parsePlatform(platform);

  if (!parsedPlatform || typeof summonerName !== 'string')
    return <><DefaultErrorPage statusCode={404} /></>

  return <>
        <div>
            <Head>
                <title>{summonerName} - {platform}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SummonerQuickInfo platform={parsedPlatform} summonerName={summonerName} />
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