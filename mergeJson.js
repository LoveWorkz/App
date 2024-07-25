// import compare_en from './compare_en.json';
// import compare_en from `./compare_en.json` assert { type: `json` };

// import en from './en.json';
const fs = require('fs');

const en = require('./en.json');
const compare_en = require('./compare_en.json');
const de = require('./de.json');
const compare_de = require('./compare_de.json');
const pt = require('./pt.json');
const compare_pt = require('./compare_pt.json');

const merge = () => {
  const en_basic_keys = Object.keys(en);
  const de_basic_keys = Object.keys(de);
  const pt_basic_keys = Object.keys(pt);

  const en_compare_keys = Object.keys(compare_en);
  const de_compare_keys = Object.keys(compare_de);
  const pt_compare_keys = Object.keys(compare_pt);

  const missing_de_json = {};
  de_compare_keys.forEach(key => {
    if (!de_basic_keys.includes(key)) {
      missing_de_json[key] = compare_de[key];
    }
  });
  const final_de_translations = {
    ...missing_de_json,
    ...de,
  };
  fs.writeFile(
    'final_de_translations.json',
    JSON.stringify(final_de_translations),
    () => {},
  );

  const missing_en_json = {};
  en_compare_keys.forEach(key => {
    if (!en_basic_keys.includes(key)) {
      missing_en_json[key] = compare_en[key];
    }
  });
  const final_en_translations = {
    ...missing_en_json,
    ...en,
  };
  fs.writeFile(
    'final_en_translations.json',
    JSON.stringify(final_en_translations),
    () => {},
  );

  const missing_pt_json = {};
  pt_compare_keys.forEach(key => {
    if (!pt_basic_keys.includes(key)) {
      missing_pt_json[key] = compare_pt[key];
    }
  });
  const final_pt_translations = {
    ...missing_pt_json,
    ...pt,
  };
  fs.writeFile(
    'final_pt_translations.json',
    JSON.stringify(final_pt_translations),
    () => {},
  );
};

merge();
