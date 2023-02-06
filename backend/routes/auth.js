const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require("express-validator");


const JwtSecret = 'heyhowareyou$doing'
// Create a user using : Post
router.post("/createuser",[
    body("name").isLength(),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],async (req, res) => {
    let success=false;
    //if there are errors, return bad requests.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      //check whether the user with this email exists or not.
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, errors: "Sorry a user with this email already exist." });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //creates a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data ={
        user : {
          id: user.id
        }
      }

      const authtoken = jwt.sign(data, JwtSecret)
      success=true;
      res.json({success, authtoken});

    } catch (err) {
      console.log(err);
    }
  }
);

//Authenticate a User
router.post("/login",[
  body("email").isEmail(),
  body("password","Password cannot be blank.").exists(),
],async (req, res) => {
  let success = false
 //if there are errors, return bad requests.
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }

 const {email, password} = req.body;
 try {
  let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res.status(400).json({ errors: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success = false
        return res.status(400).json({ success, errors: "Please try to login with correct credentials" });

      }

      const data ={
        user : {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JwtSecret);
      success = true;
      res.json({success,authtoken});

 } catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
 }

})


//Route 3: Get loggedin user details. Login Required 
router.post("/getuser", fetchuser, async (req, res) => {
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
}  catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
 }
});

module.exports = router;
