const {graphql} = require('relay-runtime');

const UserQuery = graphql`
  query UserQuery($id: ID!, $shouldDefer: Boolean!) {
    user(id: $id) {
      name
      ... @defer(if: $shouldDefer, label: "UserQuery$defer$UserDetails") {
        email
        bio
        nickname
      }
    }
  }
`;
