const dbaccessorOrders = require("../dal/db-accessor-order")
const dbOrders = new dbaccessorOrders();
const { sendOrderConfirmation, sendAdminNotification } = require("../services/email-service");

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
        // try {
        //     await sendOrderConfirmation(data, data.fullName || "לקוח", data.email);
        // } catch (emailError) {
        //     console.error("Failed to send confirmation email:", emailError);
        //     // Don't fail the order creation if email fails
        // }

        // // Send notification email to admin
        // try {
        //     await sendAdminNotification(data, data.fullName || "לקוח", data.email);
        // } catch (emailError) {
        //     console.error("Failed to send admin notification email:", emailError);
        //     // Don't fail the order creation if email fails
        // }
        
        // החזר response
        res.status(200).json({
            success: true,
            order: {
                id: data.id,
                custId: data.custId,
                fullName: data.fullName,
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

