
const mymongo = require("mongoose");


const bookScheme = new mymongo.Schema(
    {
        id: Number,
        bookName: String,
        author: String,
        description: String,
        price: Number,
        size: String,
        picture: String,  // URL של התמונה
        category: String,
    }
)

const book = mymongo.model("Book" , bookScheme , "Book");

module.exports = book;