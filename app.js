var express = require("express");

var app = express();

var port = process.env.PORT || 8000;

app.get('/',function(req,res){  //when ever server hits '/' --> 'root' the second parameter which is a function will execute
    res.send('Welcome to API');
})

app.listen(port,function(){
    console.log('Running on Port :' + port);
})