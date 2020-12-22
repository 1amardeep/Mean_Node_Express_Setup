const config = require('config');
const _= require('lodash');
const {UserClass }= require('../models/user');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');



router.post('/', async (req,res)=>{
  
    const {error} = validateUser(req.body);

    if(error) return res.status(400).send(error.details[0].message);

   const userExist = await UserClass.findOne({email : req.body.email});
   if(!userExist) return res.status(400).send('wrong user name and password');
   
    const matched =  await bcrypt.compare(req.body.password, userExist.password);
    if(!matched) return res.status(400).send('wrong user name and password');
     
    const jwtToken = userExist.generateToken();
    res.header('x-auth-token',jwtToken).send({jwtToken});
})


function validateUser(user){
    const schema = {
        email : Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);
}

module.exports = router;