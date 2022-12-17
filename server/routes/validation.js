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
    id = parseInt(id);

    if (isNaN(id)) {
      throw {
        message: `Error: ${varName} has to be a Number!`,
        code: 400,
      };
    }
    if (id < 0) {
      throw {
        message: `Error: ${varName} cannot be negative`,
        code: 400,
      };
    }
    return String(id);
  },
};
