// Dummy component file so relay-compiler finds the fragment
const {graphql} = require('relay-runtime');

const PinCard_pin = graphql`
  fragment PinCard_pin on Pin {
    id
    title
    imageUrl
    saved
    savedInfo {
      boardId
    }
  }
`;
