var express = require("express");

var mongoose = require("mongoose");
//mongoose.Promise = global.Promise;

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
        var query = {};
        if(req.query.genre){ //invalid queries will be avoided with IF condition
            query.genre = req.query.genre;
        }
        if(req.query.author){ //invalid queries will be avoided with IF condition
            query.author = req.query.author;
        }
        Book.find(query,function(err,books){
            if(err)
                res.status(500).send(err);
            else
                res.json(books);
        });
        //res.json(responseJson);
    });
bookRouter.use('/Books/:bookId',function(req,res,next){ // middleware: takes the req will add its extra functionality and sends req
    Book.findById(req.params.bookId,function(err,book){ 
            if(err)
                res.status(500).send(err);
            else if(book){
                req.book = book;
                next();
            }
            else
                res.status(404).send('No book found for given Id');
        });
});
bookRouter.route('/Books/:bookId') //retrieving by Id
    .get(function(req,res){
        res.json(req.book);
        // below code's functionality is replaced by middleware that implemented above
        // Book.findById(req.params.bookId,function(err,book){ 
        //     if(err)
        //         res.status(500).send(err);
        //     else
        //         res.json(book);
        // });
        //res.json(responseJson);
    })
    .put(function(req,res){
        //findById is required anymore as its done by middleware
        req.book.title = req.body.title;
        req.book.author = req.body.author;
        req.book.genre = req.body.genre;
        req.book.read = req.body.read;
        req.book.save(function(err){
            if(err)
                res.status(500).send(err);
            else
                res.json(req.book);
        });
    })
    .patch(function(req,res){
        if(req.body._id)
            delete req.body._id;
        for(var p in req.body){
            req.book[p] = req.body[p];
        }
        req.book.save(function(err){
            if(err)
                res.status(500).send(err);
            else
                res.json(req.book);
        });
    });

app.use('/api',bookRouter);

app.get('/',function(req,res){  //when ever server hits '/' --> 'root' the second parameter which is a function will execute
    res.send('Welcome to API');
})

app.listen(port,function(){
    console.log('Gulp is running my app on Port :' + port);
})