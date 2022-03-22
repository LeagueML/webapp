export type Platform = {
  name: string;
  short: string;
  status: boolean;
  api: string;
};

const platforms: Array<Platform> = [
  { name: "North America", short: "NA", status: true, api: "NA1" },
  { name: "Europe West", short: "EUW", status: true, api: "EUW1" },
  {
    name: "Europe Nordic & East",
    short: "EUNE",
    status: true,
    api: undefined!,
  },
  { name: "Korea", short: "KR", status: true, api: undefined! },
  { name: "Brazil", short: "BR", status: true, api: undefined! },
  { name: "Japan", short: "JP", status: true, api: undefined! },
  { name: "Russia", short: "RU", status: true, api: undefined! },
  { name: "Oceania", short: "OCE", status: true, api: undefined! },
  { name: "Turkey", short: "TR", status: true, api: undefined! },
  { name: "Latin America North", short: "LAN", status: false, api: undefined! },
  { name: "Latin America South", short: "LAS", status: false, api: undefined! },
];

export default platforms;
