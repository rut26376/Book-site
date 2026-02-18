const express = require("express")

const orderController = require("../controllers/order-controller")
const orderCtrl = new orderController()

const router = express.Router()

router.post("/newOrder", orderCtrl.createOrder)
module.exports = router