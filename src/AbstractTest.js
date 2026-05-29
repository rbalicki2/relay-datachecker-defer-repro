const {graphql} = require('relay-runtime');

// Abstract type (Node interface) with @defer
const AbstractTestQuery = graphql`
  query AbstractTestQuery($shouldDefer: Boolean!, $id: ID!) {
    node(id: $id) {
      ... on Pin {
        id
        title
        ... @defer(if: $shouldDefer, label: "AbstractTestQuery$defer$details") {
          description
          link
          saved
          savedInfo {
            boardId
          }
        }
      }
    }
  }
`;
