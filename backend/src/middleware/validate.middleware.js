const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/response');

/**
 * Higher-order middleware to run express-validator chains and halt on error
 * @param {Array} validations - Array of express-validator checks
 */
const validate = (validations) => {
  return async (req, res, next) => {
    if (Array.isArray(validations)) {
      for (const validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const firstMsg = errors.array()?.[0]?.msg || 'Validation failed';
    return badRequest(res, firstMsg, errors.array());
  };
};

module.exports = validate;
module.exports.validate = validate;
