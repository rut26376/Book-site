
const mymongo = require("mongoose");


const bookScheme = new mymongo.Schema(
    {
        id: Number,
        bookName: String,
        author: String,
        description: String,
        price: Number,
        size: String,
        picture: String,
        category: {
            main: String,    // קטגוריה ראשית
            sub: String      // קטגוריה משנית
        }
    }
)

const book = mymongo.model("Book" , bookScheme , "Book");

module.exports = book;