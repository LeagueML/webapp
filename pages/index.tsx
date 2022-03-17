import type { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';

import styles from '../styles/Home.module.css';

import { Platform, SummonerSearch } from '@league.ml/component-library';
import { BsGithub } from 'react-icons/bs'
import { GrGraphQl } from 'react-icons/gr'
import { SiStorybook } from 'react-icons/si'

const Home: NextPage = () => {
  const platforms: Array<Platform> = [
    { name: "North America", short: "NA", status: true },
    { name: "Europe West", short: "EUW", status: true },
    { name: "Europe Nordic & East", short: "EUNE", status: true },
    { name: "Korea", short: "KR", status: true },
    { name: "Brazil", short: "BR", status: true },
    { name: "Japan", short: "JP", status: true },
    { name: "Russia", short: "RU", status: true },
    { name: "Oceania", short: "OCE", status: true },
    { name: "Turkey", short: "TR", status: true },
    { name: "Latin America North", short: "LAN", status: false },
    { name: "Latin America South", short: "LAS", status: false },
  ];

  return (
    <div>
      <div className={ styles.header }>
        <span className={ styles.title }>LEAGUE.ML</span>
      </div>
      <div className={ styles.main }>
        <Head>
          <title>LEAGUE.ML</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SummonerSearch
          initialPlatform={platforms[0]}
          platforms={platforms}
          onSearch={ (name, _platform) => Router.push(`/summoner/${name}`) }
        />
      </div>
      <div className={ styles.firstFooter }>
        <div className={ styles.linkContainer }>
          <a 
            className={ styles.linkBadge } 
            href='https://github.com/LeagueML' 
            target='_blank'
            rel="noreferrer"
          >
            <BsGithub color='white' />
            <span className={ styles.link }>GitHub</span>
          </a>
        </div>
        <div className={ styles.linkContainer }>
          <a 
            className={ styles.linkBadge } 
            href='https://api.league.ml/' 
            target='_blank' 
            rel="noreferrer"
          >
            <GrGraphQl color='white' />
            <span className={ styles.link }>API</span>
          </a>
        </div>
        <div className={ styles.linkContainer }>
          <a 
            className={ styles.linkBadge } 
            href='https://components.league.ml/' 
            target='_blank' 
            rel="noreferrer"
          >
            <SiStorybook color='white' />
            <span className={ styles.link }>Components</span>
          </a>
        </div>
      </div>
      <div className={ styles.secondFooter }>
        <span className={ styles.copyright }>Copyright © 2022 LEAGUE.ML</span>
      </div>
    </div>
  );
}

export default Home;