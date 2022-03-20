/**
 * @generated SignedSource<<8f1f05ced0fbb6c8ef974c88629c1568>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type Platform = "EUW1" | "NA1" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type SummonerQuickInfo$data = {
  readonly name: string;
  readonly summonerLevel: number;
  readonly platform: Platform;
  readonly " $fragmentType": "SummonerQuickInfo";
};
export type SummonerQuickInfo$key = {
  readonly " $data"?: SummonerQuickInfo$data;
  readonly " $fragmentSpreads": FragmentRefs<"SummonerQuickInfo">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SummonerQuickInfo",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "summonerLevel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "platform",
      "storageKey": null
    }
  ],
  "type": "Summoner",
  "abstractKey": null
};

(node as any).hash = "952c11df8fa0aa367ece5766a7acff8b";

export default node;
