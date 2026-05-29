const {graphql} = require('relay-runtime');

// @skip(if: $shouldDefer) — fields only checked when shouldDefer=false
const SkipTestQuery = graphql`
  query SkipTestQuery($shouldDefer: Boolean!) {
    feed {
      edges {
        node {
          id
          title
          ... @skip(if: $shouldDefer) {
            description
            link
          }
          ... @defer(if: $shouldDefer, label: "SkipTestQuery$defer$details") {
            description
            link
          }
        }
      }
    }
  }
`;
