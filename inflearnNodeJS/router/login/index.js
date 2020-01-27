var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dydfkr32',
    database: 'cyrdb'
});
connection.connect();
router.get('/', function(req, res) {
    console.log("get login page");
    var msg;
    var errMsg = req.flash('error');
    if (errMsg) msg = errMsg;
    res.render('join.ejs', { message: msg });
});

passport.serializeUser(function(user, done) {
    console.log('passport session save : ' + user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    console.log('passport session get id ', id);
    done(null,id);
})

passport.use(
    'local-login',
    new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, id, password, done) {
            var query = connection.query('select * from user where id=?', [id], function(err, rows) {
                if (err) return done(err);
                if (rows.length) {
                    return done(null, false, { message: 'your ID is already existed' });
                } else {
                    var sql = { id: id, pw: password };
                    var query = connection.query('insert into user set ?', sql, function(err, rows) {
                        if (err) throw err;
                        return done(null, { id: id });
                    });
                }
            });
        }
    )
);

router.post(
    '/',
    function (req,res,next) {
        passport.authenticate('local-login' , function(err, user, info){
            if(err) res.status(500).json(err);
            if(!user) {
                return res.status(401).json(info.message);
            };
            req.logIn(user,function(err){
                if(err){
                    return next(err);
                }
            });
        })
    }
);

// router.post('/',function(req,res){
//     var body = req.body;
//     var id = body.id;
//     var email = body.email;
//     var name = body.name;
//     var passwd = body.password;
//     var sql = {id : id , email : email, name : name, pw : passwd};
//     var query = connection.query('insert into user set ?', sql , function(err,rows){
//         if(err){ throw err;}
//         else res.render('welcome.ejs',{'name' : name});
//     });
// });

module.exports = router;
