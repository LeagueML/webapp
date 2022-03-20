// KEEP IN SYNC WITH next.config.js!!!
module.exports = {
  language: "typescript",
  src: ".",
  schema: "./relay-stuff/schema.graphql",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  artifactDirectory: "./relay-stuff/__generated__/",
};
