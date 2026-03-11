const express = require("express")

const orderController = require("../controllers/order-controller")
const adminMiddleware = require("../middleware/admin-middleware")
const orderCtrl = new orderController()

const router = express.Router()

router.post("/newOrder", orderCtrl.createOrder)
router.get("/allOrders", adminMiddleware, orderCtrl.getAllOrders)
router.put("/updateStatus", adminMiddleware, orderCtrl.updateOrderStatus)
module.exports = router