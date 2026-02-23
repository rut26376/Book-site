const dbaccessorBooks = require("../dal/db-accessor-book")

const dbBooks = new dbaccessorBooks();

class bookController{

constructor(){}


newBook = async(req, res)=>{
    try {
        let book = req.body
        let data = await dbBooks.addBook(book)
        res.status(200).json(data)
     } catch (error) {
        console.error("Error in newBook:", error.message);
        res.status(500).json({ error: "Failed to add book" });
    }
}

    getAll = async(req, res)=>{
    try {
        let list = await dbBooks.getAll()
        res.status(200).json(list)
    } catch (error) {
        console.error("Error in getAll:", error.message);
        res.status(500).json({ error: "Failed to get books" });
    }
}
}

module.exports = bookController;

