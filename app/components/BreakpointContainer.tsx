import { PropsWithChildren } from "react";
import { LinksFunction } from "remix";
import styles from "~/styles/breakpoint-container.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function BreakpointContainer(props: PropsWithChildren<{}>) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="breakpoint-container">{props.children}</div>
    </div>
  );
}
