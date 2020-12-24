const MovieClass = require('../models/movies');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');



router.get('/', auth ,async (req,res) => {
    const movieList =  await MovieClass
    // .find({author: 'Rishi'})
    // $in, nin, gt , gte, lt, lte, eq ,neq
     // .find({ author : { $in : ['Rishi']}})
     //or and
     // limit , skip , count
     .find()
    // .or([{author : 'Rishi'}, {author : 'Ram'}])
    // .select({ name : 1, author : 1 , isPublished : 1, star : 1})
    // .count()
     .sort({author : 1});
    res.status(201).send(movieList);
})

router.get('/editMovie/:id', auth ,async (req,res) => {
    
    const movie = await MovieClass.findById(req.params.id);
    if(!movie) return res.status(404).send('No movie exist');
    res.status(201).send(movie);
})

router.post('/addMovie', async (req,res)=>{
  
    const schema = {
        name : Joi.string().min(3).required(),
        author : Joi.string().min(3).required(),
        tags : Joi.array().required(),
        isPublished : Joi.boolean().required(),
        star : Joi.number().integer().required()
    }

    const result = Joi.validate(req.body,schema);

    if(result.error) return res.status(400).send((err) => new Error(err));
   
    const movie = new MovieClass(req.body);

   try{
       const result = await movie.save();
       console.log(result);
      }catch(ex){
       console.log(ex.message);
   }
         res.send(result);
})

router.put('/:id', async (req,res) => {
     const movie = await MovieClass.findById(req.params.id);
     if(!movie) return res.status(404).send('No movie exist');
   
     const schema = {
        name : Joi.string().min(3).required(),
        author : Joi.string().min(3).required(),
        tags : Joi.array().required(),
        isPublished : Joi.boolean().required(),
        star : Joi.number().integer().required()
    }
    
    const result = Joi.validate(req.body,schema);
    console.log(result);
    if(result.error) return res.status(400).send(result.error.details[0].message);
       
     // alternative methods findById, findByIdandUpdate
    
     movie.name = req.body.name;
     movie.author = req.body.author;
     movie.tags = req.body.tags;
     movie.isPublished = req.body.isPublished;
     movie.star = req.body.star;

     const movieUpdated = await movie.save();
     console.log(movieUpdated);

    res.send(movie);
})

router.delete('/deleteMovie/:id', auth, async (req,res) => {
    const isMovie = await MovieClass.find({ _id : req.params.id});
    if(!isMovie) return res.status(404).send('No movie exist');
    
    const movie = await MovieClass.deleteOne({_id : req.params.id});

    res.send(movie);
})

module.exports = router;