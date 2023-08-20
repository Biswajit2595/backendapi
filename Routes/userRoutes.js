const express=require("express")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const { UserModel } = require("../model/userModel");
const { auth } = require("../middleware/authmiddleware");
const { ListModel } = require("../model/listModel");
const userRouter=express.Router();


// Registration
userRouter.post("/register",async(req,res)=>{
    const {pass}=req.body;
    try {
        bcrypt.hash(pass,5,async(err, hash)=> {
            if(err){
                res.send({"error":err})
            }else{
                const newUser= new UserModel({...req.body,pass:hash})
                await newUser.save()
                res.send({"msg":"New User has been added"})
            }
        });
    } catch (error) {
        res.send({'error':error})
    }
})
// Login
userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user._id,user:user.username},"masai")
                    return res.send({"msg":"Successfully Logged in",token})
                }else{
                    return res.send({"err":"wrong credentials"})
                }
            })
        }else{
            return res.send({"msg":"User does not exist"})
        }
        } catch (error) {
            return res.send({"error":error})
        }
})
// Logout
userRouter.get("/logout",auth,async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1];
    try {
        const token=new ListModel({token})
        await token.save()
        res.status(200).send({"msg":"Successfully Logged out"})
    } catch (error) {
        res.status(400).send({error})
    }
})



userRouter.patch("/update/:id",async(req,res)=>{

})


module.exports={userRouter}