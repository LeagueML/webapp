import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Summoner : NextPage = () => {
  const router = useRouter()
  const { summonerName } = router.query

  return <p>Summoner Name: {summonerName}</p>
}

export default Summoner;