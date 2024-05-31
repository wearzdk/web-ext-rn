import fs from 'node:fs';
import path from 'node:path';

// Constants for paths
const APP_RN_DIST = path.resolve('./packages/app-rn/dist/');
const EXT_DIST = path.resolve('./packages/ext/dist/');
const POPUP_HTML = path.join(EXT_DIST, 'src/popup.html');
const EXPO_DIR = path.join(EXT_DIST, '_expo');
const NEW_EXPO_DIR = path.join(EXT_DIST, 'expo');

// Copy directories and files
function copyFiles() {
  try {
    fs.rmSync(path.join(APP_RN_DIST, 'manifest.json'));
    fs.cpSync(APP_RN_DIST, EXT_DIST, { recursive: true });
    fs.cpSync(path.join(EXT_DIST, 'index.html'), POPUP_HTML);
    fs.rmSync(path.join(EXT_DIST, 'index.html'));
    fs.rmSync(path.join(EXT_DIST, '_sitemap.html'));
  }
  catch (error) {
    console.error('Error copying files:', error);
  }
}

// Move contents from one directory to another
function moveDirectoryContents(srcDir: string, destDir: string) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      moveDirectoryContents(srcPath, destPath); // Recursively move subdirectories
      fs.rmdirSync(srcPath); // Remove the empty source directory
    }
    else {
      fs.renameSync(srcPath, destPath); // Move file
    }
  }
}

// Rename directory by moving contents
function renameDirectory() {
  try {
    moveDirectoryContents(EXPO_DIR, NEW_EXPO_DIR);
    fs.rmdirSync(EXPO_DIR); // Remove the now-empty source directory
  }
  catch (error) {
    console.error('Error renaming directory:', error);
  }
}

// Replace text in file
function replaceTextInFile(filePath: string, searchValue: string | RegExp, newValue: string) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const updatedData = data.replace(searchValue, newValue);
    fs.writeFileSync(filePath, updatedData, 'utf-8');
  }
  catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

function injectStyles() {
  const styles = `
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  width: 350px;
  height: 600px;
  overflow: hidden;
}
  `;
  const styleTag = `<style>${styles}</style>`;
  const data = fs.readFileSync(POPUP_HTML, 'utf-8');
  const updatedData = data.replace('</head>', `${styleTag}</head>`);
  fs.writeFileSync(POPUP_HTML, updatedData, 'utf-8');
}

// Execute tasks
function main() {
  copyFiles();
  renameDirectory();
  replaceTextInFile(POPUP_HTML, /_expo/g, 'expo');
  injectStyles();

  console.log('Extension build completed. ', EXT_DIST);
}

main();
