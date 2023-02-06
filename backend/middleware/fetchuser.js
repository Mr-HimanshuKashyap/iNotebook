const jwt = require('jsonwebtoken');
const JwtSecret = 'heyhowareyou$doing'

const fetchuser = (req, res, next)=>{
//Get the user from the Jwt Token and add id to req object
const token = req.header('auth-token');
if(!token){
    res.status().send({error: "Not a valid token"})
}
try {
    const data = jwt.verify(token, JwtSecret);
    req.user = data.user;
    next()
} catch (error) {
    res.status().send({error: "Not a valid token"})
}
    
}

module.exports = fetchuser;