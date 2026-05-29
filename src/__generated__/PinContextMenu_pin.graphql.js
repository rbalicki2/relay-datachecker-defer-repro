/**
 * @generated SignedSource<<fa39903dfd308db86737f332d4be80c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PinContextMenu_pin",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
  ],
  "type": "Pin",
  "abstractKey": null
};

node.hash = "e1343c1a0d7b65cb10c30e4667ee617a";

module.exports = node;
