/**
 * This script handles routers for api.
 */
var express=require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false})

router.use(session({
    secret: 'ffvnh@#$%yyihjkhkses$^&$&',
    saveUninitialized:false,
    resave:false
}))

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'susanta',
    password: '1999',
    database: 'college'
  })
  connection.connect(function(err){
      if(err) throw err;
       console.log('Connected to DB');
  })

router.route('/api/status.json').all(function (req, res) {
    var obj = {};
    obj.status = "200"; //https://www.restapitutorial.com/httpstatuscodes.html
    obj.message = "API Server is running properly.";
    res.send(obj);
 });

 router.route('/api/login.json').all(function (req, res) {
    var sql="SELECT email FROM college.user WHERE email='"+req.query.email+"' and password='"+req.query.password+"';"
    var obj1 = {};
    connection.query(sql,function (err,result){
     if(result.length == 0){ //Not registered
       obj1.status = "401";
       obj1.message = "User not registered....";
       res.send(obj1);
       }
     else  {
      req.session.id=result;
        obj1.status = "200";
        obj1.message = "Thanks for logging in'"+req.query.email+"'";
    }
    })
    
 });

 router.route('/api/register.json').all(function (req, res) {
     
    var obj2 = {};
    obj2.status = "200"; //https://www.restapitutorial.com/httpstatuscodes.html
    obj2.message = "API Server is running properly.";
    res.send(obj2);
 });

 module.exports = router;
