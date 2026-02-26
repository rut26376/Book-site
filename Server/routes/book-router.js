const express = require("express")
const adminMiddleware = require("../middleware/admin-middleware")

const bookController = require("../controllers/book-controller")
const bookCtrl = new bookController()

const router = express.Router()

// Public routes
router.post("/newBook", adminMiddleware, bookCtrl.newBook)
router.get("/getAll" , bookCtrl.getAll)
router.delete("/delete/:id", adminMiddleware, bookCtrl.delete)
router.put("/edit/:id", adminMiddleware, bookCtrl.edit)
router.delete("/delete-image/:filename", adminMiddleware, bookCtrl.deleteImage)

module.exports = router