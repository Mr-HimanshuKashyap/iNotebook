const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const Note = require("../models/Note")
const { body, validationResult } = require("express-validator");

//Route 1: Get all the Notes using Get 
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
    const notes = await Note.find({user :req.user.id})
    res.json(notes)
        } 
    catch (error){
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
    
})

//Route 2: Get all the Notes using post 
router.post('/addnote', fetchuser, [
    body("title",'Enter a valid title').isLength({ min: 4 }),
    body("description",'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res)=>
    {
    try {
            
    const {title, description, tag} = req.body;

    //if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title, description, tag, user: req.user.id
    })
    const savedNote = await note.save()
    res.json(savedNote)
        } 
    catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");    
    }
})

//Route 3: Updating an existing node using :Put

router.put('/updatenote/:id', fetchuser,async (req, res)=> {
    const {title, description, tag} =req.body;
    //create a newNote object
    try{
    const newNote = {};
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    //find the note to be update and update it
    let note = await Note.findById(req.params.id)
    if(!note){res.status(404).send("Not Found")}
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")  
    }
    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note})
        }
        catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");     
        }
    })

    //Route 4: Deleting an existing node using :Delete
router.delete('/deletenote/:id', fetchuser,async (req, res)=> {
    //find the note to be delete and delete it
    try{
    let note = await Note.findById(req.params.id)
    if(!note){res.status(404).send("Not Found")}

    //Allows deletion only if it is an authenticate user
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")  
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted", note: note})
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
    })

    
module.exports = router