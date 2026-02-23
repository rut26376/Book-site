const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const sgMail = require('@sendgrid/mail');

// Force IPv4 DNS resolution
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS instead of TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD.replace(/\s/g, '')
    },
    logger: true,
    debug: true
});

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// ===== בשימוש כרגע: SendGrid (עובד עם Render) =====
// ===== ישן: Nodemailer (לבדיקה מקומית בלבד) =====

// מייל ללקוח
const sendOrderConfirmation = async (order, customerName, customerEmail) => {
    const itemsHTML = order.items.map(item => `
        <tr style="border-bottom: 1px solid #e0d5c7;">
            <td style="padding: 12px; text-align: right; font-size: 14px;">
                ${item.bookName}
            </td>
            <td style="padding: 12px; text-align: center; font-size: 14px;">
                ${item.quantity}
            </td>
            <td style="padding: 12px; text-align: center; font-size: 14px;">
                ₪${item.price.toFixed(2)}
            </td>
            <td style="padding: 12px; text-align: center; font-size: 14px; font-weight: bold;">
                ₪${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f9f7f3;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(74, 55, 40, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #4a3728 0%, #6b5344 100%);
                    color: #ffffff;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }
                .order-number {
                    color: #dcc9b6;
                    font-size: 14px;
                    margin-top: 8px;
                }
                .content {
                    padding: 30px;
                }
                .greeting {
                    color: #4a3728;
                    font-size: 16px;
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section-title {
                    color: #4a3728;
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #dcc9b6;
                    padding-bottom: 10px;
                }
                .order-details {
                    background-color: #f9f7f3;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 14px;
                    color: #333;
                }
                .detail-label {
                    font-weight: bold;
                    color: #4a3728;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .items-table th {
                    background-color: #dcc9b6;
                    color: #4a3728;
                    padding: 12px;
                    text-align: right;
                    font-weight: bold;
                    font-size: 14px;
                }
                .summary {
                    background-color: #f9f7f3;
                    padding: 20px;
                    border-radius: 6px;
                    margin-top: 20px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    font-size: 14px;
                    color: #333;
                }
                .summary-row.total {
                    border-top: 2px solid #dcc9b6;
                    padding-top: 15px;
                    margin-top: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #4a3728;
                }
                .address-info {
                    background-color: #f9f7f3;
                    padding: 15px;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #333;
                    line-height: 1.8;
                }
                .address-label {
                    font-weight: bold;
                    color: #4a3728;
                    margin-bottom: 5px;
                }
                .notes {
                    background-color: #fef3e8;
                    border-right: 4px solid #dcc9b6;
                    padding: 15px;
                    margin-top: 15px;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #333;
                }
                .footer {
                    background-color: #f9f7f3;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #e0d5c7;
                }
                .contact-info {
                    background-color: #f9f7f3;
                    padding: 15px;
                    border-radius: 6px;
                    font-size: 13px;
                    color: #666;
                    margin-top: 10px;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    background-color: #4a3728;
                    color: #ffffff;
                    padding: 12px 30px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: bold;
                    margin-top: 15px;
                }
                .shipping-info {
                    background-color: #e8f5e9;
                    border-left: 4px solid #4caf50;
                    padding: 15px;
                    border-radius: 4px;
                    margin-top: 15px;
                    font-size: 14px;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ הזמנה אושרה</h1>
                    <div class="order-number">הזמנה מספר #${order.id}</div>
                </div>

                <div class="content">
                    <div class="greeting">
                        שלום ${customerName},<br>
                        תודה רבה על הזמנתך! קיבלנו את הזמנתך בהצלחה ותוך זמן קצר נשלחנו אותה לביצוע.
                    </div>

                    <!-- פרטי ההזמנה -->
                    <div class="section">
                        <div class="section-title">📦 פרטי ההזמנה</div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>שם הספר</th>
                                    <th>כמות</th>
                                    <th>מחיר יחידה</th>
                                    <th>סה"כ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHTML}
                            </tbody>
                        </table>

                        <div class="summary">
                            <div class="summary-row">
                                <span>סה"כ ספרים:</span>
                                <span>₪${order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>עלות משלוח:</span>
                                <span>₪${order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div class="summary-row total">
                                <span>סה"כ לתשלום:</span>
                                <span>₪${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- פרטי משלוח -->
                    <div class="section">
                        <div class="section-title">🚚 כתובת משלוח</div>
                        <div class="address-info">
                            <div class="address-label">כתובת:</div>
                            ${order.street} ${order.houseNumber}<br>
                            ${order.city}
                            <br><br>
                            <div class="address-label">טלפון:</div>
                            ${order.phone}
                            <br><br>
                            <div class="address-label">אימייל:</div>
                            ${order.email}
                        </div>

                        ${order.notes ? `
                            <div class="notes">
                                <strong>🗒️ הערות:</strong><br>
                                ${order.notes}
                            </div>
                        ` : ''}

                        <div class="shipping-info">
                            ⏱️ משלוח לכל הארץ עד 3-5 ימי עסקים
                        </div>
                    </div>

                    <!-- פרטי קשר -->
                    <div class="section">
                        <div class="contact-info">
                            <strong>צור קשר עם החנות:</strong><br>
                            📧 ${process.env.STORE_EMAIL}<br>
                            📞 ${process.env.STORE_PHONE}
                        </div>
                    </div>

                    <!-- הודעה סיום -->
                    <div class="section">
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            אם יש לך שאלות או צריך לשנות משהו בהזמנה, אנא צור קשר עם שירות הלקוחות שלנו.
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p>
                        © 2026 חנות הספרים שלנו | כל הזכויות שמורות<br>
                        זה מייל אוטומטי - אנא אל תשיב עליו
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        // ===== בשימוש כרגע: SendGrid (עובד עם Render) =====
        await sgMail.send({
            to: customerEmail,
            from: process.env.STORE_EMAIL,
            subject: `✅ הזמנה אושרה - הזמנה מספר #${order.id}`,
            html: htmlContent
        });
        console.log('✅ מייל אישור הזמנה נשלח בהצלחה ל:', customerEmail);
        // ===== סוף SendGrid =====

        // ===== ישן: Nodemailer (לבדיקה מקומית בלבד) =====
        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: customerEmail,
        //     subject: `✅ הזמנה אושרה - הזמנה מספר #${order.id}`,
        //     html: htmlContent
        // });
        // console.log('✅ מייל אישור הזמנה נשלח בהצלחה ל:', customerEmail);
        // ===== סוף Nodemailer =====
    } catch (error) {
        console.error('שגיאה בשליחת מייל אישור הזמנה:', error.message);
        throw error;
    }
};

// מייל למנהל
const sendAdminNotification = async (order, customerName, customerEmail) => {
    const itemsHTML = order.items.map(item => `
        <tr style="border-bottom: 1px solid #e0d5c7;">
            <td style="padding: 12px; text-align: right; font-size: 14px;">
                ${item.bookName}
            </td>
            <td style="padding: 12px; text-align: center; font-size: 14px;">
                ${item.quantity}
            </td>
            <td style="padding: 12px; text-align: center; font-size: 14px;">
                ₪${item.price.toFixed(2)}
            </td>
            <td style="padding: 12px; text-align: center; font-size: 14px; font-weight: bold;">
                ₪${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const adminHtmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f9f7f3;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 700px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(74, 55, 40, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
                    color: #ffffff;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }
                .order-number {
                    color: #dcc9b6;
                    font-size: 14px;
                    margin-top: 8px;
                }
                .content {
                    padding: 30px;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section-title {
                    color: #4a3728;
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #dcc9b6;
                    padding-bottom: 10px;
                }
                .info-box {
                    background-color: #f9f7f3;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 14px;
                    color: #333;
                    border-bottom: 1px solid #e0d5c7;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .label {
                    font-weight: bold;
                    color: #4a3728;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .items-table th {
                    background-color: #dcc9b6;
                    color: #4a3728;
                    padding: 12px;
                    text-align: right;
                    font-weight: bold;
                    font-size: 14px;
                }
                .items-table td {
                    padding: 12px;
                    text-align: right;
                    font-size: 14px;
                    border-bottom: 1px solid #e0d5c7;
                }
                .summary {
                    background-color: #fffbf7;
                    padding: 20px;
                    border-radius: 6px;
                    margin-top: 20px;
                    border: 2px solid #dcc9b6;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    font-size: 15px;
                    color: #333;
                }
                .summary-row.total {
                    border-top: 2px solid #dcc9b6;
                    padding-top: 15px;
                    margin-top: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #8b4513;
                }
                .customer-info {
                    background-color: #f9f7f3;
                    padding: 15px;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #333;
                    line-height: 1.8;
                }
                .customer-label {
                    font-weight: bold;
                    color: #4a3728;
                    margin-bottom: 5px;
                }
                .delivery-address {
                    background-color: #e8f5e9;
                    border-left: 4px solid #4caf50;
                    padding: 15px;
                    border-radius: 4px;
                    margin-top: 15px;
                    font-size: 14px;
                    color: #333;
                }
                .alert {
                    background-color: #fff3e0;
                    border-right: 4px solid #ff9800;
                    padding: 15px;
                    border-radius: 4px;
                    margin-top: 15px;
                    font-size: 14px;
                    color: #333;
                }
                .footer {
                    background-color: #f9f7f3;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #e0d5c7;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📋 הזמנה חדשה!</h1>
                    <div class="order-number">הזמנה מספר #${order.id}</div>
                </div>

                <div class="content">
                    <!-- פרטי הלקוח -->
                    <div class="section">
                        <div class="section-title">👤 פרטי הלקוח</div>
                        <div class="customer-info">
                            <div class="customer-label">שם:</div>
                            ${customerName}
                            <br><br>
                            <div class="customer-label">אימייל:</div>
                            <a href="mailto:${customerEmail}" style="color: #4a3728; text-decoration: none;">
                                ${customerEmail}
                            </a>
                            <br><br>
                            <div class="customer-label">טלפון:</div>
                            <a href="tel:${order.phone}" style="color: #4a3728; text-decoration: none;">
                                ${order.phone}
                            </a>
                        </div>
                    </div>

                    <!-- פרטי ההזמנה -->
                    <div class="section">
                        <div class="section-title">📦 פרטי ההזמנה</div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>שם הספר</th>
                                    <th>כמות</th>
                                    <th>מחיר יחידה</th>
                                    <th>סה"כ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHTML}
                            </tbody>
                        </table>

                        <div class="summary">
                            <div class="summary-row">
                                <span>סה"כ ספרים:</span>
                                <span>₪${order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>עלות משלוח:</span>
                                <span>₪${order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div class="summary-row total">
                                <span>סה"כ לתשלום:</span>
                                <span>₪${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- כתובת משלוח -->
                    <div class="section">
                        <div class="section-title">🚚 כתובת משלוח</div>
                        <div class="delivery-address">
                            <strong>כתובת:</strong><br>
                            ${order.street} ${order.houseNumber}<br>
                            ${order.city}
                        </div>
                        ${order.notes ? `
                            <div class="alert">
                                <strong>🗒️ הערות מהלקוח:</strong><br>
                                ${order.notes}
                            </div>
                        ` : ''}
                    </div>

                    <!-- מידע חשוב -->
                    <div class="section">
                        <div class="section-title">⚡ מידע משלוח</div>
                        <div class="info-box">
                            <div class="info-row">
                                <span class="label">סטטוס הזמנה:</span>
                                <span style="background-color: #c8e6c9; padding: 4px 12px; border-radius: 4px; color: #2e7d32;">
                                    חדשה
                                </span>
                            </div>
                            <div class="info-row">
                                <span class="label">תאריך הזמנה:</span>
                                <span>${new Date(order.date).toLocaleDateString('he-IL')}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">שעת הזמנה:</span>
                                <span>${new Date(order.date).toLocaleTimeString('he-IL')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>
                        זה מייל אוטומטי לניהול הזמנות<br>
                        © 2026 חנות הספרים שלנו
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        // ===== בשימוש כרגע: SendGrid (עובד עם Render) =====
        await sgMail.send({
            to: process.env.ADMIN_EMAIL,
            from: process.env.STORE_EMAIL,
            subject: `📋 הזמנה חדשה מספר #${order.id} - ${customerName}`,
            html: adminHtmlContent
        });
        console.log('✅ מייל הודעה למנהל נשלח בהצלחה');
        // ===== סוף SendGrid =====

        // ===== ישן: Nodemailer (לבדיקה מקומית בלבד) =====
        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: process.env.ADMIN_EMAIL,
        //     subject: `📋 הזמנה חדשה מספר #${order.id} - ${customerName}`,
        //     html: adminHtmlContent
        // });
        // console.log('✅ מייל הודעה למנהל נשלח בהצלחה');
        // ===== סוף Nodemailer =====
    } catch (error) {
        console.error('שגיאה בשליחת מייל למנהל:', error.message);
        throw error;
    }
};

module.exports = { sendOrderConfirmation, sendAdminNotification };
