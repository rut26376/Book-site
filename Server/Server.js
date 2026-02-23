require("dotenv").config()
const myexpress = require("express")
const cors = require("cors")
const path = require("path")
const db = require("./dal/db-accessor")
const bookRouter = require("./routes/book-router")
const customerRouter = require("./routes/customer-router")
const orderRouter = require("./routes/order-router")
const app = myexpress()

app.use(cors())
app.use(myexpress.urlencoded({extended: true}))
app.use(myexpress.json())

// חיבור ל DB
const init = async () => {
    try {
        await db.connect()
        console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

init()

// הגדרת PORT - Render מגדיר PORT via environment
const PORT = process.env.PORT || 5000;

// Serve static files from Angular build
const clientBuildPath = path.join(__dirname, '../Client/dist/book-site/browser');
console.log(`📁 Looking for static files at: ${clientBuildPath}`);
app.use(myexpress.static(clientBuildPath));

// API routes
app.use("/books", bookRouter)
app.use("/auth", customerRouter)
app.use("/orders", orderRouter)

// Fallback to Angular index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// start server - ללא hostname בשביל Render
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


