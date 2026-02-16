const myexpress = require("express")
const customerController = require("../controllers/customer-controller")

const router = myexpress.Router()
const controller = new customerController()

router.post("/register", controller.registerCustomer)
router.post("/login", controller.loginCustomer)

module.exports = router
