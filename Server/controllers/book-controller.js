const dbaccessorBooks = require("../dal/db-accessor-book")
const fs = require('fs');
const path = require('path');

const dbBooks = new dbaccessorBooks();

// תיקיית הטמונות
const imageDir = path.join(__dirname, '../../Client/src/assets/book-img');

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
delete = async(req, res)=>{
    try {
        const bookId = req.params.id;
        
        const deletedBook = await dbBooks.delete(bookId);
        if (!deletedBook) {
            return res.status(404).json({ error: "Book not found" });
        }
        
        // מחק את התמונה של הספר אם היא קיימת
        if (deletedBook.picture) {
            const imagePath = path.join(imageDir, deletedBook.picture);
            
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (fileError) {
                    console.error(`⚠️ Failed to delete image: ${fileError.message}`);
                }
            }
        }
        
        res.status(200).json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error in delete:", error.message);
        res.status(500).json({ error: "Failed to delete book" });
    }
}

edit = async(req, res)=>{
    try {
        const bookId = req.params.id;
        const updatedData = req.body;

        // קבל את הספר הישן כדי למחוק את התמונה הישנה אם שונתה
        const oldBook = await dbBooks.getBookById(bookId);
        
        // אם התמונה שונתה, מחק את הישנה
        if (oldBook && oldBook.picture && updatedData.picture !== oldBook.picture) {
            const oldImagePath = path.join(imageDir, oldBook.picture);
            if (fs.existsSync(oldImagePath)) {
                try {
                    fs.unlinkSync(oldImagePath);
                    console.log(`🗑️ תמונה ישנה נמחקה: ${oldBook.picture}`);
                } catch (fileError) {
                    console.error(`⚠️ Failed to delete old image: ${fileError.message}`);
                }
            }
        }

        const updatedBook = await dbBooks.edit(bookId, updatedData);
        if (!updatedBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json({ success: true, book: updatedBook });
    } catch (error) {
        console.error("Error in edit:", error.message);
        res.status(500).json({ error: "Failed to update book" });
    }
}

deleteImage = async(req, res) => {
    try {
        const filename = req.params.filename;
        const imagePath = path.join(imageDir, filename);
        
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            res.status(200).json({ success: true, message: "Image deleted successfully" });
        } else {
            res.status(404).json({ error: "Image not found" });
        }
    } catch (error) {
        console.error("Error deleting image:", error.message);
        res.status(500).json({ error: "Failed to delete image" });
    }
}
}
module.exports = bookController;

