import { SummonerSearch } from "@league.ml/component-library";
import styles from "~/styles/landing.css";
import { BsGithub } from "react-icons/bs";
import { GrGraphQl } from "react-icons/gr";
import { SiStorybook } from "react-icons/si";
import { LinksFunction, MetaFunction, useNavigate } from "remix";

import platforms from "~/platforms";

export const meta: MetaFunction = () => {
  return {
    title: "LEAGUE.ML",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="header">
        <span className="title">LEAGUE.ML</span>
      </div>
      <div className="main">
        <SummonerSearch
          initialPlatform={platforms[0]}
          platforms={platforms}
          onSearch={(name, platform) =>
            navigate(
              `/summoner/${
                platforms.find((p) => platform.short === p.short)?.api
              }/${name}`
            )
          }
        />
      </div>
      <div className="firstFooter">
        <div className="linkContainer">
          <a
            className="linkBadge"
            href="https://github.com/LeagueML"
            target="_blank"
            rel="noreferrer"
          >
            <BsGithub color="white" />
            <span className="link">GitHub</span>
          </a>
        </div>
        <div className="linkContainer">
          <a
            className="linkBadge"
            href="https://api.league.ml/"
            target="_blank"
            rel="noreferrer"
          >
            <GrGraphQl color="white" />
            <span className="link">API</span>
          </a>
        </div>
        <div className="linkContainer">
          <a
            className="linkBadge"
            href="https://components.league.ml/"
            target="_blank"
            rel="noreferrer"
          >
            <SiStorybook color="white" />
            <span className="link">Components</span>
          </a>
        </div>
      </div>
      <div className="secondFooter">
        <span className="copyright">Copyright © 2022 LEAGUE.ML</span>
      </div>
    </div>
  );
}
