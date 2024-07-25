import {fs} from 'fs';

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

  let csvContent = 'data:text/csv;charset=utf-8,';

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

  // const lang2Keys = Object.keys(lang2);

  // const lackingKeysOnewWay = [];
  // const lackingKeysSecondWay = [];

  // lang1Keys.forEach(key => {
  //   if (!lang2Keys.includes(key)) {
  //     lackingKeysOnewWay.push(key);
  //   }
  // });

  // lang2Keys.forEach(key => {
  //   if (!lang1Keys.includes(key)) {
  //     lackingKeysSecondWay.push(key);
  //   }
  // });

  // console.log('LAckingOneWay: ', lackingKeysOnewWay);
  // console.log('LAckingSecondWay: ', lackingKeysSecondWay);
};

exportToCsv();
