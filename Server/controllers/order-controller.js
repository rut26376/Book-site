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

getAllOrders = async(req, res)=>{
    try {
        let list = await dbOrders.getAllOrders()
        res.status(200).json(list)
    } catch (error) {
        console.error("Error in getAllOrders:", error.message);
        res.status(500).json({ error: "Failed to get orders" });
    }
}

updateOrderStatus = async(req, res)=>{
    try {
        const { orderId, status } = req.body;
        
        // Validate status value
        const validStatuses = ["חדש", "בטיפול", "הושלם"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "סטטוס לא תקין" 
            });
        }
        
        let updatedOrder = await dbOrders.updateOrderStatus(orderId, status);
        
        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: "הזמנה לא נמצאה" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "סטטוס הזמנה עודכן בהצלחה",
            order: updatedOrder
        })
    } catch (error) {
        console.error("Error in updateOrderStatus:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "שגיאה בעדכון הסטטוס" 
        });
    }
}
}
module.exports = orderController;

