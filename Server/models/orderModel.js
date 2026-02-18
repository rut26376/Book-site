
const mymongo = require("mongoose");

const orderItemScheme = new mymongo.Schema(
    {
        bookId: Number,
        bookName: String,
        quantity: Number,
        price: Number
    },
    { _id: false }
);

const orderScheme = new mymongo.Schema(
    {
        id: Number,
        custId: Number,
        date: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ["חדש", "בטיפול", "הושלם"],
            default: "חדש"
        },
        items: [orderItemScheme],
        totalPrice: Number,
        shippingCost: Number,
        totalAmount: Number,
        street: String,
        houseNumber: String,
        city: String,
        email: String,
        phone: String,
        notes: String
    }
)

const order = mymongo.model("Orders", orderScheme, "Orders");

module.exports = order;