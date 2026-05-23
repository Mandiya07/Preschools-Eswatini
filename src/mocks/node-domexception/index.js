/**
 * Custom mock replacing the deprecated node-domexception package
 * with the platform's native DOMException available in Node.js 18+.
 */
module.exports = globalThis.DOMException;
