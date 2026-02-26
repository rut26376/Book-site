require("dotenv").config()
const myexpress = require("express")
const cors = require("cors")
const path = require("path")
const db = require("./dal/db-accessor")
const bookRouter = require("./routes/book-router")
const customerRouter = require("./routes/customer-router")
const orderRouter = require("./routes/order-router")
const uploadRouter = require("./routes/upload-router")
const app = myexpress()

app.use(cors())
app.use(myexpress.urlencoded({extended: true, limit: '50mb'}))
app.use(myexpress.json({limit: '50mb'}))

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

// Check if directory exists
const fs = require('fs');
if (!fs.existsSync(clientBuildPath)) {
  console.warn(`⚠️ Static files directory not found: ${clientBuildPath}`);
}

app.use(myexpress.static(clientBuildPath));

// Middleware להגדרת headers שמונעים caching של תמונות
app.use((req, res, next) => {
  if (req.path.includes('/assets/book-img/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// Serve book images from Client/src/assets/book-img
const booksImgPath = path.join(__dirname, '../Client/src/assets/book-img');
app.use('/assets/book-img', myexpress.static(booksImgPath));

// API routes
app.use("/books", bookRouter)
app.use("/auth", customerRouter)
app.use("/orders", orderRouter)
app.use("/", uploadRouter)

// Fallback to Angular index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// start server - ללא hostname בשביל Render
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


