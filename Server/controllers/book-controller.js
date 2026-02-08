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
        throw console.log(error)
    }
}

    getAll = async(req, res)=>{
    try {
        let list = await dbBooks.getAll()
        res.status(200).json(list)
    } catch (error) {
        throw console.log(error)
    }
}
}

module.exports = bookController;

