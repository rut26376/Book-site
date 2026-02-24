
const mymongo = require("mongoose");


const customerScheme = new mymongo.Schema(
    {
        id: Number,
        fullName: String,
        password: String,
        phone: String,
        street: String,
        houseNumber: String,
        city: String,
        email: String,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    }
)

const customer = mymongo.model("Customers", customerScheme, "Customers");

module.exports = customer;