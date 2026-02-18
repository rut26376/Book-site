const nodemailer = require("nodemailer");

// Configure your email service (Gmail, Outlook, etc.)
// For Gmail, you need to generate an "App Password" from your Google Account
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "your-app-password"
    }
});

class EmailService {
    constructor() {}

    // Send order confirmation email
    sendOrderConfirmation = async (order, customerEmail, customerName) => {
        try {
            const itemsList = order.items
                .map(item => `<li>${item.bookName} - כמות: ${item.quantity} × ₪${item.price}</li>`)
                .join("");

            const htmlContent = `
                <div style="direction: rtl; font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333; text-align: center;">✅ ההזמנה התקבלה בהצלחה!</h2>
                        
                        <p style="color: #666; font-size: 16px;">
                            שלום <strong>${customerName}</strong>,
                        </p>
                        
                        <p style="color: #666; font-size: 16px;">
                            תודה על הזמנתך! מספר ההזמנה שלך הוא: <strong>#${order.id}</strong>
                        </p>

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

                        <h3 style="color: #333;">פרטי ההזמנה:</h3>
                        <ul style="color: #666; font-size: 14px; line-height: 1.8;">
                            ${itemsList}
                        </ul>

                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="color: #666; margin: 8px 0;">
                                <strong>סכום מוצרים:</strong> ₪${order.totalPrice}
                            </p>
                            <p style="color: #666; margin: 8px 0;">
                                <strong>עלות משלוח:</strong> ₪${order.shippingCost}
                            </p>
                            <p style="color: #333; font-size: 18px; margin: 12px 0; border-top: 1px solid #ddd; padding-top: 12px;">
                                <strong>סה"כ לתשלום:</strong> ₪${order.totalAmount}
                            </p>
                        </div>

                        <h3 style="color: #333;">כתובת משלוח:</h3>
                        <p style="color: #666; font-size: 14px; line-height: 1.8;">
                            ${order.street} ${order.houseNumber}<br>
                            ${order.city}
                        </p>

                        <h3 style="color: #333;">פרטי ההוזמה:</h3>
                        <p style="color: #666; font-size: 14px; line-height: 1.8;">
                            <strong>טלפון:</strong> ${order.phone}<br>
                            <strong>מייל:</strong> ${order.email}<br>
                            <strong>תאריך הזמנה:</strong> ${new Date(order.date).toLocaleDateString("he-IL")}
                        </p>

                        ${order.notes ? `
                            <h3 style="color: #333;">הערות:</h3>
                            <p style="color: #666; font-size: 14px;">${order.notes}</p>
                        ` : ""}

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

                        <p style="color: #666; font-size: 14px; text-align: center;">
                            נחמד מלהיות איתך! אנחנו נשלח עדכון כשההזמנה תשלח.
                        </p>
                        
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            זהו מייל אוטומטי - אנא אל תשיב עליו ישירות
                        </p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: process.env.EMAIL_USER || "your-email@gmail.com",
                to: customerEmail,
                subject: `✅ אישור הזמנה מס' ${order.id} - חנות הספרים שלנו`,
                html: htmlContent
            };

            await transporter.sendMail(mailOptions);
            console.log(`Order confirmation email sent to ${customerEmail}`);
            return true;
        } catch (error) {
            console.error("Error sending order confirmation email:", error);
            throw error;
        }
    };

    // Send admin notification
    sendAdminNotification = async (order, adminEmail) => {
        try {
            const itemsList = order.items
                .map(item => `<li>${item.bookName} - כמות: ${item.quantity} × ₪${item.price}</li>`)
                .join("");

            const htmlContent = `
                <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">🛒 הזמנה חדשה!</h2>
                        
                        <p style="color: #666;">
                            <strong>מס' הזמנה:</strong> #${order.id}
                        </p>

                        <h3 style="color: #333;">פרטי הלקוח:</h3>
                        <p style="color: #666;">
                            <strong>שם:</strong> ${order.customerName || "לא זמין"}<br>
                            <strong>מייל:</strong> ${order.email}<br>
                            <strong>טלפון:</strong> ${order.phone}
                        </p>

                        <h3 style="color: #333;">מוצרים:</h3>
                        <ul style="color: #666;">
                            ${itemsList}
                        </ul>

                        <p style="color: #666;">
                            <strong>סה"כ:</strong> ₪${order.totalAmount}
                        </p>

                        <h3 style="color: #333;">כתובת משלוח:</h3>
                        <p style="color: #666;">
                            ${order.street} ${order.houseNumber}, ${order.city}
                        </p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: process.env.EMAIL_USER || "your-email@gmail.com",
                to: adminEmail,
                subject: `הזמנה חדשה מס' ${order.id}`,
                html: htmlContent
            };

            await transporter.sendMail(mailOptions);
            console.log(`Admin notification email sent to ${adminEmail}`);
            return true;
        } catch (error) {
            console.error("Error sending admin notification email:", error);
            throw error;
        }
    };
}

module.exports = new EmailService();
