const books = require("../models/bookModel")

class dbaccessorBooks{
    constructor(){}

addBook = async(book)=>{
    try {
        await books.create(book)
        this.getAll();
    } catch (error) {
        throw console.error(error)
    }
}


getAll = async()=>{
    try {
        const allBooks = await books.find({})
        return allBooks;
    } catch (error) {
        throw console.error(error)
    }

}
}

module.exports = dbaccessorBooks;