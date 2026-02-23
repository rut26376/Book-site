const mymongo = require("mongoose")

const connectDB = {}

connectDB.connect = async()=>{
    try {
        // Use MongoDB Atlas URI from environment variable for production, or local for development
        console.log(`📋 MONGODB_URI env var exists: ${!!process.env.MONGODB_URI}`);
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/Books"
        console.log(`🔗 Connecting to MongoDB: ${mongoUri.substring(0, 50)}...`)
        console.log(`🔗 Full URI: ${mongoUri}`);
        await mymongo.connect(mongoUri)
        console.log("✅ Connection successfully to mongoDB");
    } catch (error) {
        console.error("❌ Mongxxxxxxxxxction Error:", error.message);
        throw error;
    }
}

module.exports = connectDB