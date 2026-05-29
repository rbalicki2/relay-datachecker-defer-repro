/**
 * @generated SignedSource<<9f3e2928dd0264bdaf28cabd035a3686>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "shouldDefer"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrl",
  "storageKey": null
},
v4 = {
  "condition": "shouldDefer",
  "kind": "Condition",
  "passingValue": true,
  "selections": [
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
  ]
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "IncludeTestQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FeedConnection",
        "kind": "LinkedField",
        "name": "feed",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "FeedEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Pin",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "kind": "Defer",
                    "selections": (v5/*: any*/)
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
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
    "name": "IncludeTestQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FeedConnection",
        "kind": "LinkedField",
        "name": "feed",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "FeedEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Pin",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "if": "shouldDefer",
                    "kind": "Defer",
                    "label": "IncludeTestQuery$defer$details",
                    "selections": (v5/*: any*/)
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "69718cf72d82d4b23c226815459b91c2",
    "id": null,
    "metadata": {},
    "name": "IncludeTestQuery",
    "operationKind": "query",
    "text": "query IncludeTestQuery(\n  $shouldDefer: Boolean!\n) {\n  feed {\n    edges {\n      node {\n        id\n        title\n        imageUrl\n        ... @defer(if: $shouldDefer, label: \"IncludeTestQuery$defer$details\") {\n          description\n          link\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "805bb92ce07484d7a5519ad63c0fd21a";

module.exports = node;
