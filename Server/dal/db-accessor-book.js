const books = require("../models/bookModel")

class dbaccessorBooks{
    constructor(){}

addBook = async(book)=>{
    try {
        const newBook = await books.create(book)
        return newBook;
    } catch (error) {
        console.error("Error adding book:", error);
        throw error;
    }
}

getAll = async()=>{
    try {
        const allBooks = await books.find({})
        return allBooks;
    } catch (error) {
        console.error("Error getting books:", error);
        throw error;
    }

}

delete = async(id)=>{
    try {
        const deletedBook = await books.findOneAndDelete({ id: id })
        return deletedBook;
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
}
}

module.exports = dbaccessorBooks;