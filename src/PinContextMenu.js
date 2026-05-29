// Dummy component file so relay-compiler finds the fragment
const {graphql} = require('relay-runtime');

const PinContextMenu_pin = graphql`
  fragment PinContextMenu_pin on Pin {
    id
    description
    link
    saved
    savedInfo {
      boardId
    }
  }
`;
