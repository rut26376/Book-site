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

getBookById = async(id)=>{
    try {
        const book = await books.findOne({ id: id })
        return book;
    } catch (error) {
        console.error("Error getting book:", error);
        throw error;
    }
}

edit = async(id, updatedData)=>{
    try {
        const updatedBook = await books.findOneAndUpdate({ id: id }, updatedData, { new: true })
        return updatedBook;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
}
}

module.exports = dbaccessorBooks;