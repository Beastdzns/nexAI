const { withPlugins } = require('next-composed-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins(
  {
    swcMinify: true,
    reactStrictMode: true,
    compiler: {
      emotion: true,
    },
    webpack: (config) => {
      // Enable importing mp4 (and similar) media assets as URLs
      config.module.rules.push({
        test: /\.(mp4|webm|ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name]-[hash][ext]',
        },
      });
      return config;
    },
  },
  [withBundleAnalyzer],
);
