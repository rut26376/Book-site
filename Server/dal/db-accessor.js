const mymongo = require("mongoose")

const url = "mongodb://localhost:27017"
const dbName = "Books"

const connectDB = {}

connectDB.connect = async()=>{
    try {
        await mymongo.connect(`${url}/${dbName}`)
        console.log("Connection successfully to mongoDB");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB