const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")

// read env
require("dotenv").config()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))    
app.use(cookieParser())

// Statically serve the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const port = process.env.PORT

// Read All Routes
let indexRouter = require("./routes/index")
const { errorHandler } = require("./middleware/errorHandler")
app.use(indexRouter)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`)
})    


