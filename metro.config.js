// This app vendors its @arli/* packages under ./vendor and depends on them via
// "file:./vendor/<pkg>" in package.json, which npm resolves to a symlink under
// node_modules — same mechanism a workspace protocol dependency uses. Metro
// needs to be told to follow that symlink; it does not by default.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
