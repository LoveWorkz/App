const fs = require('fs/promises');
const resolveRoot = require('../resolveRoot');
const reduxSliceTemplate = require('./reduxSliceTemplate');
const schemaTypeTemplate = require('./schemaTypeTemplate');

module.exports = async (layer, sliceName) => {
  const resolveModelPath = (...segments) =>
    resolveRoot('src', layer, sliceName, 'model', ...segments);

  const createModelStructure = async () => {
    try {
      await fs.mkdir(resolveModelPath());
      await fs.mkdir(resolveModelPath('types'));
      await fs.mkdir(resolveModelPath('Store'));
    } catch (e) {
      console.log(`Failed to create model segment for slice ${sliceName}`, e);
    }
  };

  const createStore = async () => {
    try {
      await fs.writeFile(
        resolveModelPath('Store', `${sliceName}Store.ts`),
        reduxSliceTemplate(sliceName),
      );
    } catch (e) {
      console.log('Failed to create Redux slice', e);
    }
  };

  const createSchemaType = async () => {
    try {
      await fs.writeFile(
        resolveModelPath('types', `${sliceName}Types.ts`),
        schemaTypeTemplate(sliceName),
      );
    } catch (e) {
      console.log('Failed to create state schema type', e);
    }
  };

  await createModelStructure();
  await createStore();
  await createSchemaType();
};
