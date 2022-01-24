/**
 * This script handles routers for api.
 */
var express=require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var transaction = require('node-mysql-transaction');
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


/*
        THE LOGIN ROUTE

        */
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

/*
          THE REGISTRATION ROUTE

*/

 router.route('/api/register.json').all(function (req, res) {
    var sql="SELECT email FROM college.user WHERE email='"+req.query.email+"';"
    var obj2 = {};
    connection.query(sql,function(err,result){
     if(result.length == 0){ //Not registered
       var sql1="insert into college.user values('"+ req.query.email +"','"+ req.query.password +"','"+ req.query.name+"');"
       connection.query(sql1, function (err) {
           if (err) throw err
           obj2.status = "200";
           obj2.message = "You just got registered!!! Please go for login";
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
	obj3.status="200";
    obj3.message =req.session.name;
    res.send(obj3);
  })  
  /*
        CREATE TIMETABLE
  */
   router.route('/api/createTimeTable.json').all(function(req,res){
     connection.pause();
    var obj4 ={};

    var trCon = transaction({
      connection: [mysql.createConnection,{
        host: 'localhost',
        user: 'RoutineGeneration',
        password: 'cst',
        database: 'college'
      }],
      dynamicConnection:32
    })
    
    var chain = trCon.chain();
    
    chain.
    on('commit', function(){
      obj4.status ="200";
      obj4.message = "Successfully entered!!";
      res.send(obj4);
    }).
    on('rollback', function(err){
      obj4.status ="401";
      obj4.message = "Error occurred!";
      res.send(obj4);
    });
    
    
    chain.query("INSERT INTO college.time_schedule VALUES('"+req.query.time_schedule_name+"','CCP','10:30',6,30,'"+req.session.email+"');").
    
    
    query("INSERT INTO college.working_days VALUES('MON','full','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.working_days VALUES('TUE','full','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.working_days VALUES('WED','full','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.working_days VALUES('THU','full','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.working_days VALUES('FRI','full','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.working_days VALUES('SAT','half','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.working_days VALUES('SUN','none','"+req.query.time_schedule_name +"');").
    
    
    query("INSERT INTO college.sem VALUES('IV','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.sem VALUES('VI','"+req.query.time_schedule_name +"');").
    
    query("INSERT INTO college.subject VALUES(null,'Networking','IV',3,0,0,1,'..Slot Pref..','"+req.query.time_schedule_name+"');").
    query("INSERT INTO college.subject VALUES(null,'Microprocessor','IV',3,0,0,1,'..Slot Pref..','"+req.query.time_schedule_name+"');").
    query("INSERT INTO college.subject VALUES(null,'Microprocessor Lab','IV',3,0,0,1,'..Slot Pref..','"+req.query.time_schedule_name+"');").
    
    query("INSERT INTO college.teacher VALUES(null,'G.D.',5,'..Time Matirx..','"+req.query.time_schedule_name +"');").
    query("INSERT INTO college.teacher VALUES(null,'B.K.',5,'..Time Matirx..','"+req.query.time_schedule_name +"');");
    

   }) 

   connection.resume(function(err){
     if(err) throw err;
     console.log('DB resumed');
     
   });
 

  /*
        GET TIMETABLES
  */

   router.route('/api/getTimeTables.json').all(function(req,res){

    var sql="SELECT * FROM college.time_schedule WHERE time_schedule_name='"+req.query.time_schedule_name+"';"
    var obj5 = {};
    connection.query(sql,function (err,result,fields){
     if(result.length == 0){ 
       obj5.status = "404";
       obj5.message = "info about error";
       res.send(obj5);
      }
       else{
        obj5.status="200";
        obj5.message="Successfully retrieved";
        obj5.list = result;
        res.send(obj5);
       }
})

   });

    //Update Time Table
   router.route('/api/updateTimeTable.json').all(function(req,res){

    var obj6 ={};
    var sql="UPDATE college.time_schedule SET ins_name='"+req.query.ins_name+"',start_time='"+req.query.start_time+"',slot_count='"+req.query.slot_count+"',recess_duration='"+req.query.recess_duration+"' WHERE time_schedule_name='"+req.query.time_schedule_name+"';"
    connection.query(sql,function(err,result,fields){
      if(err){
        obj6.status ="401";
        obj6.message ="Error occurred!!";
        res.send(obj6); 
      } 
      else{
        obj6.status ="200";
        obj6.message = "Successfully updated!!!";
        
      }
    })


   })

//Get Working Days

router.route('/api/getWorkingDays.json').all(function(req,res){

  var sql="SELECT * FROM college.working_days WHERE fk_time_schedule_name='"+req.query.time_schedule_name+"';"
  var obj5 = {};
  connection.query(sql,function (err,result,fields){
   if(result.length == 0){ 
     obj5.status = "404";
     obj5.message = "info about error";
     res.send(obj5);
    }
     else{
      obj5.status="200";
      obj5.message=result;
      res.send(obj5);
     }
})

 });

 //Update Working Day

 router.route('/api/updateWorkingDay.json').all(function(req,res){

  var obj7 ={};
  var sql="UPDATE college.working_days SET full_half='"+req.query.full_half+"' WHERE fk_time_schedule_name='"+req.query.time_schedule_name+"' and days_name='"+req.query.days_name+"';"
  connection.query(sql,function(err,result,fields){
    if(err){
     throw err
    } 
    else{
      console.log(result);
      if(result.affectedRows == 0){
        obj7.status ="401";
        obj7.message ="Error occurred!!";
        res.send(obj7);
      }
      else{
      obj7.status ="200";
      obj7.message = "Successfully updated!!!";
      res.send(obj7);
      }
    }
  })


 });

//    Update Sem

router.route('/api/updateSem.json').all(function(req,res){
  connection.pause();
  var obj8 ={};
  var trCon = transaction({
    connection: [mysql.createConnection,{
      host: 'localhost',
      user: 'RoutineGeneration',
      password: 'cst',
      database: 'college'
    }],
    dynamicConnection:32
  })
  
  var chain = trCon.chain();
  
  chain.
  on('commit', function(){
    obj8.status ="200";
    obj8.message = "Successfully entered!!";
    res.send(obj8);
  }).
  on('rollback', function(err){
    obj8.status ="401";
    obj8.message = "Error occurred!";
    res.send(obj8);
  });

  chain.query("DELETE FROM college.sem ;");
  for(var i =0 ;i<req.query.list.length; i++){
    chain.query("INSERT INTO college.sem VALUES('"+req.query.list[i]+"','"+req.query.time_schedule_name+"');");
  }
    
  });

  connection.resume(function(err){
    if(err) throw err;
    console.log('DB resumed');
    
  });

  //getSems


  router.route('/api/getSems.json').all(function(req,res){

    var sql="SELECT * FROM college.time_schedule WHERE time_schedule_name='"+req.query.time_schedule_name+"';"
    var obj5 = {};
    connection.query(sql,function (err,result,fields){
     if(result.length == 0){ 
       obj5.status = "404";
       obj5.message = "info about error";
       res.send(obj5);
      }
       else{
        obj5.status="200";
        obj5.message="Successfully retrieved";
        obj5.list = result;
        res.send(obj5);
       }
})

   });








   


 module.exports = router;
