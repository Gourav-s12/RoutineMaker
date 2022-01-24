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
    user: 'RoutineGeneration',
    password: 'cst',
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
    var sql="SELECT * FROM college.user WHERE email='"+req.query.email+"';"
    var obj1 = {};
    connection.query(sql,function (err,result,fields){
     if(result.length == 0){ //Not registered
       obj1.status = "404";
       obj1.message = "User not registered....";
       res.send(obj1);
       }
     else  {
      console.log(result);
      console.log(result[0].password);
        if(result[0].password != req.query.password){
          obj1.status="401";
          obj1.message = "Wrong password!!!Enter it right...";
          res.send(obj1);
        }
        else{
         req.session.email=result[0].email;
          req.session.name = result[0].name;
          obj1.status = "200";
          obj1.message = "Thanks for logging in'"+req.query.email+"'";
          res.send(obj1);
        }
      
     
     
    }
    })
    
 });

 router.route('/api/register.json').all(function (req, res) {
    var sql="SELECT email FROM college.user WHERE email='"+req.query.email+"';"
    var obj2 = {};
    connection.query(sql,function(err,result){
     if(result.length == 0){ //Not registered
       var sql1="insert into college.user values('"+ req.query.email +"','"+ req.query.password +"','"+ req.query.name+"');"
       connection.query(sql1, function (err) {
           if (err) throw err
           obj2.status = "200";
           obj2.message = "You just got registered!!! Please go to login";
           res.send(obj2);

        })
       }
     else  {
      obj2.status = "401";
      obj2.message = "Already registerd...Go for login";
      res.send(obj2);
     }
    }) 
  });
  router.route('/api/getUserInfo.json').all(function(req,res){
    var obj3 = {};
    obj3.message =req.session.name;
    res.send(obj3);
  })  
  
    




 module.exports = router;
