const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name : { 
        type : String,
        required : true,
        minlength : 3,
        maxlength : 255
     },
    author : String,
    tags : {
        type : Array,
        validate : {
            validator : function(v){
                return (v && v.length) > 0;
            },
            message : 'should have at least one tag'
        }
    },
    date : {
        type : Date,
        default : Date.now
    },
    isPublished: Boolean,
    star : {
       type : Number,
       required : function () {return this.isPublished},
       min : 1,
       max : 5
    }
})

const MovieClass = mongoose.model('movie',movieSchema );

module.exports = MovieClass;