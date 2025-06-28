// ===============================================================
// pack all entry to output folder.
// ===============================================================
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    // [output-file] : [input-file]
    // "custom.js"  : path.resolve(__dirname, 'src/ts-js/custom.js'),
    "main.js"  : path.resolve(__dirname, 'src/ts-js/main.js'),
    "theme_v2.0.js"  : path.resolve(__dirname, 'src/ts-js/theme_v2.0.js'),
  },
  output: {
    path: path.resolve(__dirname, 'site/js'),
    filename: '[name]'
  }
};