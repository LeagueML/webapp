/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // KEEP IN SYNC WITH relay.config.js!!!
    relay: {
      language: "typescript",
      src: ".",
      schema: "./relay-stuff/schema.graphql",
      exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
      artifactDirectory: "./relay-stuff/__generated__/",
    },
    removeConsole: {
      exclude: ["error"],
    },
  },
  swcMinify: true,
  images: {
    loader: "custom",
  },
};

module.exports = nextConfig;
