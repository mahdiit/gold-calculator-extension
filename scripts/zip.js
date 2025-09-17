// zip.js - create a zip of dist/ as gold-price-extension-built.zip
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const dist = path.join(__dirname, '..', 'dist');
const outPath = path.join(__dirname, '..', 'gold-price-extension-built.zip');
const output = fs.createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('Wrote ' + outPath);
});

archive.on('error', function(err){
  throw err;
});

archive.pipe(output);
archive.directory(dist, false);
archive.finalize();