const express = require("express")
const adminMiddleware = require("../middleware/admin-middleware")

const bookController = require("../controllers/book-controller")
const bookCtrl = new bookController()

const router = express.Router()

// Public routes
router.post("/newBook", adminMiddleware, bookCtrl.newBook)
router.get("/getAll" , bookCtrl.getAll)

module.exports = router