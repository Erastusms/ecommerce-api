/* eslint-disable no-plusplus */
module.exports = {
  getValues: (length) => {
    const value = [];
    for (let i = 1; i <= length; i++) {
      value.push(`$${i}`);
    }
    return value.join(',');
  }
};
