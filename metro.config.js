// Monorepo configuration.
// Metro does not look outside an app's own folder by default, so a workspace
// package (@arli/*) resolves to nothing without this. See
// https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole workspace so edits to packages/* trigger a reload.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the app first, then the hoisted workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. The @arli/* packages ship raw TypeScript (no build step), so Metro must
//    follow the symlinks npm creates for workspace dependencies.
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
