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
                    console.log(`🗑️ Image deleted: ${deletedBook.picture}`);
                } catch (fileError) {
                    console.error(`⚠️ Failed to delete image: ${fileError.message}`);
                    // לא נחזיר error - הספר כבר נמחק מה-DB
                }
            }
        }
        
        res.status(200).json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error in delete:", error.message);
        res.status(500).json({ error: "Failed to delete book" });
    }
}
}

module.exports = bookController;

