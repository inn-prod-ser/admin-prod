const createNextIntlPlugin = require( "next-intl/plugin" );
const withNextIntl = createNextIntlPlugin( "./i18n/request.ts" );

const nextConfig = {
  webpack( config, { isServer } ) {
    if ( !isServer ) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withNextIntl( nextConfig );