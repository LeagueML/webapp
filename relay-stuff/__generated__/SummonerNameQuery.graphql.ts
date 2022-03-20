/**
 * @generated SignedSource<<1ddcbb1cf8503d9f06fa93d7efee7e46>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Platform = "EUW1" | "NA1" | "%future added value";
export type SummonerNameQuery$variables = {
  platform: Platform;
  summonerName: string;
};
export type SummonerNameQuery$data = {
  readonly getSummonerByName: {
    readonly name: string;
    readonly platform: Platform;
    readonly " $fragmentSpreads": FragmentRefs<"SummonerQuickInfo">;
  } | null;
};
export type SummonerNameQuery = {
  variables: SummonerNameQuery$variables;
  response: SummonerNameQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "platform"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "summonerName"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "summonerName"
  },
  {
    "kind": "Variable",
    "name": "platform",
    "variableName": "platform"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "platform",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SummonerNameQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Summoner",
        "kind": "LinkedField",
        "name": "getSummonerByName",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SummonerQuickInfo"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SummonerNameQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Summoner",
        "kind": "LinkedField",
        "name": "getSummonerByName",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2fa5c93d3230fa2c5d2a51e0a9e9a7ee",
    "id": null,
    "metadata": {},
    "name": "SummonerNameQuery",
    "operationKind": "query",
    "text": "query SummonerNameQuery(\n  $platform: Platform!\n  $summonerName: String!\n) {\n  getSummonerByName(platform: $platform, name: $summonerName) {\n    name\n    platform\n    ...SummonerQuickInfo\n    id\n  }\n}\n\nfragment SummonerQuickInfo on Summoner {\n  name\n  summonerLevel\n  platform\n}\n"
  }
};
})();

(node as any).hash = "7f3ece771d29ed6d355ba139959494e4";

export default node;
