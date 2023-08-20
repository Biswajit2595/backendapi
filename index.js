const express=require("express")
const cors=require("cors")
const { connection } = require("./db")
const { userRouter } = require("./Routes/userRoutes")
const { noteRouter } = require("./Routes/noteRoutes")
const app=express()

app.use(cors())
app.use(express.json())
app.use("/users",userRouter)
app.use("/notes",noteRouter)

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})




app.listen(8000,async(req,res)=>{
    try {
        await connection
        console.log("connected to MOngoAtlas")
        console.log("server is running at port 8000")
    } catch (error) {
        res.send({error})
    }
})