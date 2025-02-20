const fs = require('fs/promises');
const resolveRoot = require('../resolveRoot');
const firstCharUpperCase = require('../firstCharUpperCase');

module.exports = async (layer, sliceName) => {
  const componentName = firstCharUpperCase(sliceName);

  try {
    await fs.writeFile(
      resolveRoot('src', layer, sliceName, 'index.ts'),
      `export {${componentName}} from './ui/${componentName}/${componentName}';`,
    );
  } catch (e) {
    console.log('Failed to create PUBLIC API');
  }
};
