const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const authMiddleware = require('./Middlewares/authMiddleware')
require('dotenv').config()
const userRouter = require('./Routes/UserRoutes')
const authRouter = require('./Routes/AuthRoutes')
const fieldRouter = require('./Routes/FeatureRoutes')

app.use(express.json({limit:"1000mb"}));
app.use(cors());

const connectDB = ()=> {
    mongoose.connect(process.env.connectionURL).then(()=> {
        console.log("Database connected");
    })
}

app.get('/', (req,res)=> {
    res.send("Welcome")
})

app.use("/auth", authRouter);
app.use("/user", authMiddleware, userRouter);
app.use("/feature/", fieldRouter)

const start = async ()=> {
    try {
        connectDB();
        app.listen(process.env.port, ()=> {
            console.log("Server Running at port", process.env.port);
        })
    }
    catch(error) {
        console.log(error);
    }
}

start()