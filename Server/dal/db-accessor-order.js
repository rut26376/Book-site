const orders = require("../models/orderModel")

class dbaccessorOrders {
    constructor() { }

    getLastOrderId = async () => {
        try {
            const lastOrder = await orders.findOne().sort({ id: -1 }).limit(1)
            return lastOrder;
        } catch (error) {
            throw error
        }
    }

    createOrder = async (order) => {
        try {
            let newOrder = await orders.create(order)
            return newOrder;
        } catch (error) {
            throw error
        }
    }

        getAllOrders = async () => {
        try {
            let allOrders = await orders.find()
            return allOrders;
        } catch (error) {
            throw error
        }
    }

    updateOrderStatus = async (orderId, newStatus) => {
        try {
            let updatedOrder = await orders.findOneAndUpdate(
                { id: orderId },
                { status: newStatus },
                { new: true }
            )
            return updatedOrder;
        } catch (error) {
            throw error
        }
    }
}

module.exports = dbaccessorOrders;