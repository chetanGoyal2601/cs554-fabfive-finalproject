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
  checkNumber(strVal, varName) {
    if (strVal === null || strVal === undefined)
      throw { message: `Error: You must provide a ${varName}`, code: 400 };
    // if (typeof strVal !== "string")
    //   throw { message: `Error:${varName} must be a string`, code: 400 };
    if (typeof strVal == "string") strVal = strVal.trim();
    if (strVal.length === 0)
      throw {
        message: `Error: ${varName} cannot be an empty string or just spaces`,
        code: 400,
      };
    if (isNaN(strVal))
      throw {
        message: `Error: ${strVal} is not a valid value for ${varName} as it does not contain only number`,
        code: 400,
      };
    strVal = parseInt(strVal);
    if (strVal < 0)
      throw {
        message: `Error: ${strVal} is not a valid value for ${varName} as it should be a positive number`,
        code: 400,
      };
    return strVal;
  },
  checkFloat(strVal, varName) {
    if (strVal === null || strVal === undefined)
      throw { message: `Error: You must provide a ${varName}`, code: 400 };
    // if (typeof strVal !== "string")
    //   throw { message: `Error:${varName} must be a string`, code: 400 };
    if (typeof strVal == "string") strVal = strVal.trim();
    if (strVal.length === 0)
      throw {
        message: `Error: ${varName} cannot be an empty string or just spaces`,
        code: 400,
      };
    if (isNaN(strVal))
      throw {
        message: `Error: ${strVal} is not a valid value for ${varName} as it does not contain only number`,
        code: 400,
      };
    strVal = parseFloat(strVal);
    if (strVal < 0)
      throw {
        message: `Error: ${strVal} is not a valid value for ${varName} as it should be a positive number`,
        code: 400,
      };
    return strVal;
  },
  checkAddress2(strVal, varName) {
    if (!strVal) strVal = null;
    else {
      if (typeof strVal !== "string")
        throw { message: `Error:${varName} must be a string`, code: 400 };
      strVal = strVal.trim();
      if (strVal.length === 0) strVal = "";
    }
    return strVal;
  },
};
