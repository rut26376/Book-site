
const mymongo = require("mongoose");


const customerScheme = new mymongo.Schema(
    {
        id: Number,
        fullName: String,
        password: String,
        phone: String,
        street: String,
        city: String,
        email: String
    }
)

const customer = mymongo.model("Customers", customerScheme, "Customers");

module.exports = customer;