const {graphql} = require('relay-runtime');

// @include(if: $shouldDefer) gates client extension fields
// When shouldDefer=true, DataChecker enters @include and checks client extension fields
// When shouldDefer=false, DataChecker skips @include block entirely
const IncludeTestQuery = graphql`
  query IncludeTestQuery($shouldDefer: Boolean!) {
    feed {
      edges {
        node {
          id
          title
          imageUrl
          ... @include(if: $shouldDefer) {
            saved
            savedInfo {
              boardId
            }
          }
          ... @defer(if: $shouldDefer, label: "IncludeTestQuery$defer$details") {
            description
            link
          }
        }
      }
    }
  }
`;
