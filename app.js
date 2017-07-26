var express = require("express");

var mongoose = require("mongoose");

var bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/bookAPI');

var Book = require('./models/bookModel');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

var bookRouter  = express.Router();

bookRouter.route('/Books')
    .post(function(req,res){
        var book = new Book(req.body); //body-parser extract the entire body portion of an incoming request stream and exposes it on req.body
        console.log(book);
        book.save();
        res.send(book);
    })
    .get(function(req,res){
        //var responseJson = {hello : "This is my API"};
        Book.find(function(err,books){
            if(err)
                console.log(err);
            else
                res.json(books);
        });
        //res.json(responseJson);
    });

app.use('/api',bookRouter);

app.get('/',function(req,res){  //when ever server hits '/' --> 'root' the second parameter which is a function will execute
    res.send('Welcome to API');
})

app.listen(port,function(){
    console.log('Gulp is running my app on Port :' + port);
})