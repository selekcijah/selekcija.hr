const { buildSeoRedirects } = require("./redirects.seo");

/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  return {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "images.prismic.io" },
        { protocol: "https", hostname: "selekcija.cdn.prismic.io" },
        { protocol: "https", hostname: "img.youtube.com" },
      ],
    },
    async redirects() {
      return buildSeoRedirects();
    },
    webpack: (config, { dev }) => {
      if (dev) {
        config.optimization = {
          ...config.optimization,
          runtimeChunk: false,
        };
      }
      return config;
    },
  };
};

module.exports = nextConfig;
