const {graphql} = require('relay-runtime');

const FeedQuery = graphql`
  query FeedQuery($shouldDefer: Boolean!) {
    feed {
      edges {
        node {
          ...PinCard_pin
          ... @defer(if: $shouldDefer, label: "FeedQuery$defer$PinContextMenu") {
            ...PinContextMenu_pin
          }
        }
      }
    }
  }
`;
