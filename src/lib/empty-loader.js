// This custom loader function transforms the input into an empty JavaScript module.
// Used to prevent Turbopack/Webpack from trying to process non-code files
// (like .md or .proto) as JavaScript that it can't parse.
module.exports = function(source) {
  // The 'source' argument is the content of the file being loaded.
  // We ignore it and return a string representing an empty JS module.
  return 'module.exports = {};';
};
