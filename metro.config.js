const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for path aliases
config.resolver.alias = {
  ...config.resolver.alias,
  '@': path.resolve(__dirname, 'src'),
  '@assets': path.resolve(__dirname, 'assets'),
};

// Add support for importing assets
config.resolver.sourceExts = [...config.resolver.sourceExts, 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

module.exports = config;

