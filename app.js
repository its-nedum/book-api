const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//Connect to mongoDB
const db = mongoose.connect('mongodb://localhost/bookAPI',{ useNewUrlParser: true })
    .then(() => console.log('Connection to database was successful!...'))
    .catch((error) => console.log('Connection error: ', error));

//Set port
const port = process.env.PORT || 3000;

//Importing our book model
const Book = require('./models/bookModel');

//Importing the book route
const bookRouter = require('./routes/bookRouter')(Book);

//Set up body-parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//Use the book route
app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send("Welcome to my Node Express API");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
});