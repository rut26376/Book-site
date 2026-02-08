const express = require("express")

const bookController = require("../controllers/book-controller")
const bookCtrl = new bookController()

const router = express.Router()

router.post("/newBook", bookCtrl.newBook)
router.get("/getAll" , bookCtrl.getAll)


module.exports = router