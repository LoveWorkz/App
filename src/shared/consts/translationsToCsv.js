var fs = require('fs');

const en = require('./en.json');
const de = require('./de.json');
const pt = require('./pt.json');

const exportToCsv = () => {
  const translationKeys = Object.keys(en);

  const rows = [];

  translationKeys.forEach(key => {
    const row = [key, de[key], en[key], pt[key]];
    rows.push(row);
  });

  let csvContent = '';

  rows.forEach(function (rowArray) {
    let row = rowArray.join(';');
    csvContent += row + '\r\n';
  });

  fs.writeFile('./translations.csv', csvContent, 'utf8', function (err) {
    if (err) {
      console.log(
        'Some error occured - file either not saved or corrupted file saved.',
      );
    } else {
      console.log("It's saved!");
    }
  });
};

exportToCsv();
