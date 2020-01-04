var express = require("express");
var app = express();
var router = express.Router();
var mysql = require("mysql");
var path = require("path");

var connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : 'dydfkr32',
    database : "cyrdb"
});
connection.connect();

router.get("/", function(req,res){
    res.render("join.ejs");
});

router.post("/",function(req,res){
    var body = req.body;
    var id = body.id;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;
    var sql = {id : id , email : email, name : name, pw : passwd};
    var query = connection.query('insert into user set ?', sql , function(err,rows){
        if(err){ throw err;}
        else res.render("welcome.ejs",{'name' : name});
    });
});

module.exports = router;