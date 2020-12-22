const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
    name : { 
        type : String,
        required : true,
        minlength : 5,
        maxlength : 255
     },
     email : { 
        type : String,
        required : true,
        minlength : 5,
        maxlength : 255,
        unique : true
     },
     password : { 
        type : String,
        required : true,
        minlength : 5,
        maxlength : 1024
     }   
})

userSchema.methods.generateToken = function(){
   const token = jwt.sign({name : this.name , _id : this._id}, config.get('password'));
   return token ;
}

const UserClass = mongoose.model('user',userSchema );

function validateUser(user){
    const schema = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);
}

module.exports.UserClass = UserClass;
module.exports.validate = validateUser;