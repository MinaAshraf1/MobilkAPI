const {body} = require("express-validator");

const validation = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage("Name is required")
            .isLength({min: 3})
            .withMessage("Name should be 3 letters or more"),
        body('price')
            .notEmpty()
            .withMessage("Price is required")
    ]       
}

module.exports = {validation};