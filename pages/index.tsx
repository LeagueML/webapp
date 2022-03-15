import type { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';

import styles from '../styles/Home.module.css';

import { SummonerSearch } from '@league.ml/component-library';
import { BsGithub } from 'react-icons/bs'
import { GrGraphQl } from 'react-icons/gr'
import { SiStorybook } from 'react-icons/si'

const Home: NextPage = () => {
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
          initialPlatform='EUW' 
          onSearch={ () => Router.push(`/summoner/${(document.querySelector('.nameInput') as HTMLInputElement)!.value}`) }
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