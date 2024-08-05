const en = require('./en.json');
const de = require('./de.json');
const pt = require('./pt.json');

const check = (lang1, lang2) => {
  const lang1Keys = Object.keys(lang1);
  const lang2Keys = Object.keys(lang2);

  const lackingKeysOnewWay = [];
  const lackingKeysSecondWay = [];

  lang1Keys.forEach(key => {
    if (!lang2Keys.includes(key)) {
      lackingKeysOnewWay.push(key);
    }
  });

  lang2Keys.forEach(key => {
    if (!lang1Keys.includes(key)) {
      lackingKeysSecondWay.push(key);
    }
  });

  console.log('LAckingOneWay: ', lackingKeysOnewWay);
  console.log('LAckingSecondWay: ', lackingKeysSecondWay);
};

console.log('Portugal eng');
check(pt, en);
console.log('Portugal german');
check(pt, de);
console.log('English german');
check(en, de);
