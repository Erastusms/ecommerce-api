/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
const _ = require('lodash');

const camelCaseConverter = (key) => {
  let tempKey = key.replace(/_/g, ' ');
  let camelCase = '';
  tempKey = tempKey.split(' ');
  if (tempKey.length > 1) {
    camelCase = tempKey.map((word, i) => {
      if (i > 0) return word[0].toUpperCase() + word.slice(1);
    });
    camelCase[0] = tempKey[0];
    camelCase = camelCase.join();
    camelCase = camelCase.replace(/,/g, '');
  } else camelCase = tempKey[0];
  return camelCase;
};

const keyArrayObjectSubtitution = (obj) => {
  if (!_.isEmpty(obj) && obj.length > 0) {
    const newObj = obj.map((dt) => keyObjectSubtitution(dt));
    return newObj;
  }
};

const keyObjectSubtitution = (obj) => {
  const newData = {};
  let newKey = '';
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    newKey = camelCaseConverter(keys[i]);
    if (typeof obj[keys[i]] === 'object' && obj[keys[i]] !== null) {
      if (obj[keys[i]].length >= 1) {
        newData[newKey] = keyArrayObjectSubtitution(obj[keys[i]]);
      } else if (obj[keys[i]].length === undefined) {
        if (obj[keys[i]] instanceof Date) newData[newKey] = obj[keys[i]];
        else newData[newKey] = keyObjectSubtitution(obj[keys[i]]);
      }
    } else {
      newData[newKey] = obj[keys[i]];
    }
  }
  return newData;
};

module.exports = {
  keyObjectSubtitution
};
