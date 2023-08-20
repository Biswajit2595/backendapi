const express=require("express")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { NoteModel } = require("../model/notesModel");
const { auth } = require("../middleware/authmiddleware");
const noteRouter=express.Router();


// CREATE
noteRouter.post("/create",auth,async(req,res)=>{
    try {
        const newNote=req.body
        const note=new NoteModel(newNote)
        await note.save()
        res.send({"msg":"New note has been added"})
    } catch (error) {
        res.send({error})
    }
})

// READ
noteRouter.get("/",auth,async(req,res)=>{
    try {
        const notes=await NoteModel.find({userID:req.body.userID})
        res.send(notes)
    } catch (error) {
        res.send({error})
    }
})

//UPDATE
noteRouter.patch("/update/:noteID",auth,async(req,res)=>{
    const {noteID}=req.params;
    const note=await NoteModel.findOne({_id:noteID})
    try {
        if(req.body.userID!==note.userID){
            res.send({"msg":"You are not Authorized to make changes"})
        }else{
            await NoteModel.findByIdAndUpdate({_id:noteID},req.body)
            res.send({"msg":`Note with _id:${noteID} has been updated`})
        }
    } catch (error) {
        res.send({"error":error})
    }
})

// DELETE
noteRouter.delete("/delete/:noteID",auth,async(req,res)=>{
    const {noteID}=req.params;
    const note=await NoteModel.findOne({_id:noteID})
    try {
        if(req.body.userID!==note.userID){
            res.send({"msg":"You are not Authorized to make changes"})
        }else{
        const notes=await NoteModel.findByIdAndDelete({_id:noteID})
        res.send({"msg":`Note with _id:${noteID} has been deleted`})
        }
    } catch (error) {
        res.send({error})
    }
})



module.exports={noteRouter}
