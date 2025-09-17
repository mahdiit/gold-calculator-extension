// copyStatic.js - copies root files and public icons into dist/
const fs = require('fs');
const path = require('path');

const fromPublic = path.join(__dirname, '..', 'public');
const dist = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.lstatSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyDir(fromPublic, dist);
fs.copyFileSync(path.join(__dirname, '..', 'manifest.json'), path.join(dist, 'manifest.json'));
console.log('static copied to dist/');
