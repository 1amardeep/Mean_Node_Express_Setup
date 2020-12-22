
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied. No token provided.')
   try{
   const decodePayload = jwt.verify(token,config.get('password'));
   req.user = decodePayload;
   next();
   }catch(ex){
       res.status(400).send('Invalid token.')
   }
}