var fs = require('fs');

const enCurrent = require('./en.json');
const enBackup = require('./backups/en_22_09_24.json');
const ptBackup = require('./backups/pt_22_09_24.json');
const deBackup = require('./backups/de_22_09_24.json');

const getLackingKeys = (keys1, keys2) => {
  const lang1Keys = Object.keys(keys1);
  const lang2Keys = Object.keys(keys2);

  const lackingKeys = [];

  lang2Keys.forEach(key => {
    if (!lang1Keys.includes(key)) {
      lackingKeys.push(key);
    }
  });

  return lackingKeys;
};

const generateLackingKeysCSV = (keys, de, en, pt) => {
  const rows = [];
  let csvContent = '';

  keys.forEach(key => {
    const row = [
      'generated filler to match excel structure',
      key,
      de[key],
      en[key],
      pt[key],
    ];
    rows.push(row);
  });

  rows.forEach(function (rowArray) {
    let row = rowArray.join('|');
    csvContent += row + '\r\n';
  });

  fs.writeFile('./lackingTranslations.csv', csvContent, 'utf8', function (err) {
    if (err) {
      console.error(
        'Some error occured - file either not saved or corrupted file saved.',
      );
    } else {
      console.info('Lacking keys saved!');
    }
  });
};

const lackingEnKeys = getLackingKeys(enCurrent, enBackup);
console.log('lacking EN backup vs current:', lackingEnKeys);
generateLackingKeysCSV(lackingEnKeys, deBackup, enBackup, ptBackup);
