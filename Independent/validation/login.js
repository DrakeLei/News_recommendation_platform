const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {};

  //because validator.isEmpty only accept string. we need first to change it to string

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
