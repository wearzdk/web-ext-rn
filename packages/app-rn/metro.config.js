const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(workspaceRoot);

// 在此处定义额外的 monorepo 包
const monorepoPackages = {
  // '@web-ext-rn/models': path.resolve(workspaceRoot, 'packages/models'),
};

config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];
config.resolver.extraNodeModules = monorepoPackages;

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
