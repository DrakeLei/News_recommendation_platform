const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validatePostInput(data) {
  let errors = {};

  //because validator.isEmpty only accept string. we need first to change it to string

  data.text = !isEmpty(data.text) ? data.text : "";
  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "post length must be between 10 and 300";
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "text field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
