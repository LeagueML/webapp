import { ReactNode } from "react";
import { Provider } from "urql";
import urql from "urql-stuff";

const client = urql.createClient();

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Provider value={client}>
        <main>{children}</main>
      </Provider>
    </>
  );
}
