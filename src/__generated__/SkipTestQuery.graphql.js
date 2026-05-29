/**
 * @generated SignedSource<<f4f6f268ac2497790f6a582007d901f7>>
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
v3 = [
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
],
v4 = {
  "condition": "shouldDefer",
  "kind": "Condition",
  "passingValue": false,
  "selections": (v3/*: any*/)
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SkipTestQuery",
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
                  (v4/*: any*/),
                  {
                    "kind": "Defer",
                    "selections": (v3/*: any*/)
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
    "name": "SkipTestQuery",
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
                  (v4/*: any*/),
                  {
                    "if": "shouldDefer",
                    "kind": "Defer",
                    "label": "SkipTestQuery$defer$details",
                    "selections": (v3/*: any*/)
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
    "cacheID": "8ab3661f5c05fdfa5d3ebaa0af44cdf1",
    "id": null,
    "metadata": {},
    "name": "SkipTestQuery",
    "operationKind": "query",
    "text": "query SkipTestQuery(\n  $shouldDefer: Boolean!\n) {\n  feed {\n    edges {\n      node {\n        id\n        title\n        description @skip(if: $shouldDefer)\n        link @skip(if: $shouldDefer)\n        ... @defer(if: $shouldDefer, label: \"SkipTestQuery$defer$details\") {\n          description\n          link\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "4caacd5e6c1373e9fcd0a5d9005b1c0c";

module.exports = node;
