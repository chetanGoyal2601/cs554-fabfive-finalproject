const { ObjectId } = require("mongodb");

module.exports = {
  checkId(id, varName) {
    if (!id)
      throw { message: `Error: You must provide a ${varName}`, code: 400 };
    if (typeof id !== "string")
      throw { message: `Error:${varName} must be a string`, code: 400 };
    id = id.trim();
    if (id.length === 0)
      throw {
        message: `Error: ${varName} cannot be an empty string or just spaces`,
        code: 400,
      };
    if (!ObjectId.isValid(id))
      throw {
        message: `Error: ${varName} invalid object ID`,
        code: 400,
      };
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal)
      throw { message: `Error: You must provide a ${varName}`, code: 400 };
    if (typeof strVal !== "string")
      throw { message: `Error:${varName} must be a string`, code: 400 };
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw {
        message: `Error: ${varName} cannot be an empty string or just spaces`,
        code: 400,
      };
    if (!isNaN(strVal))
      throw {
        message: `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`,
        code: 400,
      };
    return strVal;
  },

  //   checkStringArray(arr, varName) {
  //     //We will allow an empty array for this,
  //     //if it's not empty, we will make sure all tags are strings
  //     let arrayInvalidFlag = false;
  //     if (!arr || !Array.isArray(arr))
  //       throw `You must provide an array of ${varName}`;
  //     for (i in arr) {
  //       if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
  //         arrayInvalidFlag = true;
  //         break;
  //       }
  //       arr[i] = arr[i].trim();
  //     }
  //     if (arrayInvalidFlag)
  //       throw `One or more elements in ${varName} array is not a string or is an empty string`;
  //     return arr;
  //   },
};
