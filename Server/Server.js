const myexpress = require("express")
const cors = require("cors")
const db  = require("./dal/db-accessor")
const bookRouter = require("./routes/book-router")
const customerRouter = require("./routes/customer-router")
const app = myexpress()

app.use(cors())
app.use(myexpress.urlencoded({extends:true}))
app.use(myexpress.json())

//חיבור ל DB
const init = async()=>{
    await db.connect()
}

init()

const hostname="localhost"
const port = 5000
app.listen(port, hostname, ()=>{
    console.log(`Server running at ${hostname}:${port}`);
})

app.use("/books", bookRouter)
app.use("/auth", customerRouter)


