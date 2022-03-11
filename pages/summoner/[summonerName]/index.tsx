import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Query } from 'urql'

const Summoner : NextPage = () => {
  const router = useRouter()
  const { summonerName } = router.query

  return <>
        <p>Summoner Name: {summonerName}</p>
        <Query query={ "{ query { test } }" } variables={ "$summonerName = " }>{
        (data) => 
            <p>{JSON.stringify(data)}</p>
        }
        </Query>
    </>
}

export default Summoner;