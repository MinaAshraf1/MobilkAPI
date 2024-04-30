const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: Object,
        required: true
    },
    cart: {
        type: Array
    }
})

module.exports = mongoose.model("Cart", cartSchema);