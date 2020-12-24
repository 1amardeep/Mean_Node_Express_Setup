const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require("cors");
const config = require('config');
const mongoose = require('mongoose');


const moviesRoutes = require('./routes/movies');
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/',homeRoutes);
app.use('/api/movies',moviesRoutes);
app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use(helmet());
app.use(compression());

console.log("Application name : "+ config.get('name'));
//console.log("password : "+ config.get('password'));
console.log("mail name : "+ config.get('mail.host'));

if(!config.get('password')){
    console.error("FATAL ERROR : JWT KEY is not set");
    process.exit(1);
}

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
}



// process.env.NODE_ENV by default undefined
// to set process env variable run : set NODE_ENV=production in cmd

mongoose.connect(config.get('vidly_db'), { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connected to moongose db'))
.catch( (err) => console.log(err))

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`listening to port ${port}............`);
})
