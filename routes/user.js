const auth = require('../middleware/auth');
const _= require('lodash');
const {UserClass,validate }= require('../models/user');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');



router.get('/me', auth ,async (req,res) => {
    const userList =  await UserClass
     .findById(req.user._id).select('-password');
    res.status(201).send(userList);
})

router.get('/',async (req,res) => {
    const userList =  await UserClass
     .find();
    res.status(201).send(userList);
})

router.post('/addUser', async (req,res)=>{
  
    const {error} = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

   const userExist = await UserClass.findOne({email : req.body.email});
   if(userExist) return res.status(400).send('User already exist');
   
    const user = new UserClass(_.pick(req.body, ['name', 'email', 'password']));
    const salt =  await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword ;
     
   try{
       const result = await user.save();
      }catch(ex){
       console.log(ex.message);
   }
       const jwtToken = user.generateToken();
         res.header('x-auth-token',jwtToken).send(_.pick(user, ['name', 'email', 'password' , '_id']));
})

module.exports = router;