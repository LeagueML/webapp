import { gql, useQuery } from 'urql'
import GraphQLError from '@/components/GraphQLError';

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

export type SummonerQuickInfoProps = {
    platform: string;
    summonerName: string;
}

export default function SummonerQuickInfo({platform, summonerName} : SummonerQuickInfoProps) {

  const [result, reexecute] = useQuery({ query: query, variables: {
        platform, summonerName
    },
  })
  
  const { data, fetching, error } = result

  if (fetching) return <>Loading...</>
  if (error) return <><GraphQLError error={error}></GraphQLError></>

  return <>
        <div>
            <p>Summoner Name: {summonerName}</p>
            <p>{JSON.stringify(data)}</p>
        </div>
    </>
}