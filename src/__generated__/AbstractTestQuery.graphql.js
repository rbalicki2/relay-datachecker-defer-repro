/**
 * @generated SignedSource<<ec78663956ea5affad6a1a06f8ba7827>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "shouldDefer"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "description",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "link",
    "storageKey": null
  },
  {
    "kind": "ClientExtension",
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "saved",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "SaveTarget",
        "kind": "LinkedField",
        "name": "savedInfo",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "boardId",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AbstractTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "Defer",
                "selections": (v5/*: any*/)
              }
            ],
            "type": "Pin",
            "abstractKey": null
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AbstractTestQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              {
                "if": "shouldDefer",
                "kind": "Defer",
                "label": "AbstractTestQuery$defer$details",
                "selections": (v5/*: any*/)
              }
            ],
            "type": "Pin",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b346ebe621734dad5ac04c55879e79ad",
    "id": null,
    "metadata": {},
    "name": "AbstractTestQuery",
    "operationKind": "query",
    "text": "query AbstractTestQuery(\n  $shouldDefer: Boolean!\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on Pin {\n      id\n      title\n      ... @defer(if: $shouldDefer, label: \"AbstractTestQuery$defer$details\") {\n        description\n        link\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e3de059f3a62c6e64f97229749a7ad99";

module.exports = node;
