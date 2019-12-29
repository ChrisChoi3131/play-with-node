var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");
var connection = mysql.createConnection({
    host : "localhost",
    port : 3300,
    user : "root",
    password : 'dydfkr32',
    database : "CYRDB"
});
connection.connect();

app.listen(3000,function(){
    console.log("start express server on port 3000");
    console.log(__dirname);
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" ,"ejs");

app.get('/', function(req,res){
    res.sendFile(__dirname + "/public/main.html");
});

app.get('/main', function(req,res){
    res.sendFile(__dirname + "/public/main.html");
});

app.post('/email_post',function(req,res){
    console.log(req.body);
//    res.send("<h1>welcom " + req.body.email + "</h1>");
    res.render('email.ejs' , {"email" : req.body.email});
});

app.post("/ajax_send_email", function(req,res){
    console.log(req.body.email);
    var responseData = {"result" : "OK", "email" : req.body.email};
    res.json(responseData);
});