const dbaccessorCustomers = require("../dal/db-accessor-customer")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const dbCustomers = new dbaccessorCustomers();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-this"

class customerController{

constructor(){}

registerCustomer = async(req, res)=>{
    try {
        let customer = req.body
        
        // בדוק אם אימייל כבר קיים
        let existingCustomer = await dbCustomers.findCustomerByEmail(customer.email)
        if(existingCustomer) {
            return res.status(400).json({ success: false, message: "אימייל זה כבר רשום" })
        }
        
        // Hash הסיסמא
        const hashedPassword = await bcrypt.hash(customer.password, 10)
        customer.password = hashedPassword
        
        // קבל את ID הבא
        const lastCustomer = await dbCustomers.getLastCustomerId()
        customer.id = lastCustomer ? lastCustomer.id + 1 : 1
        
        // שמור ב-DB
        let data = await dbCustomers.registerCustomer(customer)
        
        // Generate JWT token
        const token = jwt.sign(
            { id: data.id, email: data.email },
            SECRET_KEY,
            { expiresIn: "7d" }
        )
        
        // החזר response
        res.status(200).json({
            success: true,
            token: token,
            user: {
                id: data.id, // המספר הסדרתי
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                city: data.city,
                street: data.street,
                houseNumber: data.houseNumber
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "שגיאה בהרשמה" })
    }
}

loginCustomer = async(req, res)=>{
    try {
        const { email, password } = req.body
        
        // בדוק אם אימייל קיים
        let customer = await dbCustomers.findCustomerByEmail(email)
        if(!customer) {
            return res.status(401).json({ success: false, message: "אימייל או סיסמא לא נכונים" })
        }
        
        // בדוק סיסמא
        const validPassword = await bcrypt.compare(password, customer.password)
        if(!validPassword) {
            return res.status(401).json({ success: false, message: "אימייל או סיסמא לא נכונים" })
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: customer.id, email: customer.email },
            SECRET_KEY,
            { expiresIn: "7d" }
        )
        
        // החזר response
        res.status(200).json({
            success: true,
            token: token,
            user: {
                id: customer.id, // המספר הסדרתי
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone,
                city: customer.city,
                street: customer.street,
                houseNumber: customer.houseNumber
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "שגיאה בהתחברות" })
    }
}

getNextCustomerId = async(req, res)=>{
    try {
        // קבל את ID הלקוח הגדול ביותר מה-DB
        const lastCustomer = await dbCustomers.getLastCustomerId()
        const nextId = lastCustomer ? lastCustomer.id + 1 : 1
        
        res.status(200).json({
            success: true,
            nextId: nextId
        })
    } catch (error) {
        console.log(error)
        // אם יש שגיאה, התחל מ-1
        res.status(200).json({
            success: true,
            nextId: 1
        })
    }
}

updateCustomerProfile = async(req, res)=>{
    try {
        const { id, fullName, email, phone, city, street, houseNumber } = req.body
        
        // בדוק אם לקוח קיים
        let customer = await dbCustomers.findCustomerById(id)
        if(!customer) {
            return res.status(404).json({ success: false, message: "לקוח לא נמצא" })
        }
        
        // עדכן את הנתונים
        customer.fullName = fullName || customer.fullName
        customer.email = email || customer.email
        customer.phone = phone || customer.phone
        customer.city = city || customer.city
        customer.street = street || customer.street
        customer.houseNumber = houseNumber || customer.houseNumber
        
        // שמור את העדכונים ל-DB
        let updatedCustomer = await dbCustomers.updateCustomer(id, customer)
        
        // החזר response
        res.status(200).json({
            success: true,
            message: "הפרטים עודכנו בהצלחה",
            user: {
                id: updatedCustomer.id,
                fullName: updatedCustomer.fullName,
                email: updatedCustomer.email,
                phone: updatedCustomer.phone,
                city: updatedCustomer.city,
                street: updatedCustomer.street,
                houseNumber: updatedCustomer.houseNumber
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "שגיאה בעדכון הפרטים" })
    }
}
}
module.exports = customerController;

