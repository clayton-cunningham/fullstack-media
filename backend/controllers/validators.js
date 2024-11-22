
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid input.", 422);
    }
}

exports.checkValidation = checkValidation;