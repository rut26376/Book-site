const dbaccessorOrders = require("../dal/db-accessor-order")
const dbOrders = new dbaccessorOrders();
const emailService = require("../services/email-service");

class orderController{

constructor(){}

createOrder = async(req, res)=>{
    try {
        let order = req.body; 
        
        // Get next ID from database
        const lastOrder = await dbOrders.getLastOrderId()
        order.id = lastOrder ? lastOrder.id + 1 : 1
        
        let data = await dbOrders.createOrder(order)
        
        // Send confirmation email to customer
        try {
            await emailService.sendOrderConfirmation(data, data.email, data.customerName || "לקוח");
        } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError);
            // Don't fail the order creation if email fails
        }
        
        // החזר response
        res.status(200).json({
            success: true,
            order: {
                id: data.id,
                custId: data.custId,
                date: data.date,
                status: data.status,
                items: data.items,
                totalPrice: data.totalPrice,
                shippingCost: data.shippingCost,
                totalAmount: data.totalAmount,
                street: data.street,
                houseNumber: data.houseNumber,
                city: data.city,
                email: data.email,
                phone: data.phone,
                notes: data.notes
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "שגיאה בהרשמה" })
    }
}

}
module.exports = orderController;

