var express=require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var router = express.Router();
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// Create application/x-www-form-urlencoded parser

app.use(express.static('public'));
app.get('/new.html', function (req, res) {
   res.sendFile( __dirname + "/" + "new.html" );
})



var connection = mysql.createConnection({
  host: 'localhost',
  user: 'riju',
  password: 'chaki',
  database: 'college'
})
connection.connect(function(err){
    if(err) throw err;
     console.log('Connected');
})
app.get('/new.html', function (req, res) {
   console.log('getting it');
   res.sendFile(__dirname+'/new.html');
 })

//change kora baki ache
app.post('/submit', urlencodedParser, function (req, res) {
   
   var sqli="SELECT name FROM college.new WHERE name='"+ req.body.name +"','"+ req.body.password +"';"
   connection.query(sqli,function(err,result){
  
         if(result.length==0){
            res.redirect('/api/register.json/:{result}');
            }
         
         else{
            var sql="insert into new values(null,'"+ req.body.name +"','"+ req.body.password +"')"
            connection.query(sql, function (err) {
               req.session.id=result;
               res.redirect('/api/register.json/:{result}')
         })
      }

   })

 
    
  
   connection.end();
   })
   module.exports = router;
    
   var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })
 