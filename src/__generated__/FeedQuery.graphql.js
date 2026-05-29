/**
 * @generated SignedSource<<0fd068d143531d4e9c884eeac35c96ff>>
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FeedQuery",
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
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PinCard_pin"
                  },
                  {
                    "kind": "Defer",
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "PinContextMenu_pin"
                      }
                    ]
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
    "name": "FeedQuery",
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "imageUrl",
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "if": "shouldDefer",
                    "kind": "Defer",
                    "label": "FeedQuery$defer$PinContextMenu",
                    "selections": [
                      (v1/*: any*/),
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
                      (v2/*: any*/)
                    ]
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
    "cacheID": "2c87e94572043562c9ab69c9d2f77627",
    "id": null,
    "metadata": {},
    "name": "FeedQuery",
    "operationKind": "query",
    "text": "query FeedQuery(\n  $shouldDefer: Boolean!\n) {\n  feed {\n    edges {\n      node {\n        ...PinCard_pin\n        ...PinContextMenu_pin @defer(if: $shouldDefer, label: \"FeedQuery$defer$PinContextMenu\")\n        id\n      }\n    }\n  }\n}\n\nfragment PinCard_pin on Pin {\n  id\n  title\n  imageUrl\n}\n\nfragment PinContextMenu_pin on Pin {\n  id\n  description\n  link\n}\n"
  }
};
})();

node.hash = "93bc2bf82c47a3673ebadcc82161abd4";

module.exports = node;
