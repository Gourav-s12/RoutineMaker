/**
 * This script handles routers for api.
 */
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var transaction = require('node-mysql-transaction');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})
var gen = require('./genO');
var atob = require('atob');
var btoa = require('btoa');

//--------------Session & DB Connection & Logging Function--------------
router.use(session({
  secret: 'ffvnh@#$%yyihjkhkses$^&$&',
  saveUninitialized: false,
  resave: false
}))
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'RoutineGeneration',
  password: 'cst',
  database: 'college'
})
connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected to DB');
});

function logApi(req, obj) {
  console.log();
  console.log("URL Requested:" + req.url);
  console.log("Input Parameters:" + JSON.stringify(req.query));
  console.log("Output:" + JSON.stringify(obj));
}

//--------------API Route Pages--------------
//--Status Route--
router.route('/api/status.json').all(function (req, res) {
  var obj = {};
  obj.status = "200"; //https://www.restapitutorial.com/httpstatuscodes.html
  obj.message = "API Server is running properly.";
  res.send(obj);
  logApi(req, obj);
});

//--login Route--
router.route('/api/login.json').all(function (req, res) {
  var sql = "SELECT * FROM college.user WHERE email='" + req.query.email + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.length == 0) { //Not registered
      obj.status = "404";
      obj.message = "User not registered....";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    if (result[0].password != req.query.password) {
      obj.status = "401";
      obj.message = "Wrong password! Please try again.";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    req.session.email = result[0].email;
    req.session.name = result[0].name;
    obj.status = "200";
    obj.message = "Thanks for logging in'" + req.query.email + "'";
    res.send(obj);
    logApi(req, obj);
  });
});

//--register Route--
router.route('/api/register.json').all(function (req, res) {
  let sql = "SELECT email FROM college.user WHERE email='" + req.query.email + "';"
  let obj = {};
  connection.query(sql, function (err, result) {
    if (result.length == 0) { //Not registered
      let sql1 = "Insert into college.user values('" + req.query.email + "','" + req.query.password + "','" + req.query.name + "');"
      connection.query(sql1, function (err) {
        if (err) {
          obj.status = "469";
          obj.message = err.sqlMessage;
          res.send(obj);
          logApi(req, obj);
          return;
          throw err;
        }
        obj.status = "200";
        obj.message = "Registration successful! Please login.";
        res.send(obj);
        logApi(req, obj);
      });
    } else { //Already registerd
      obj.status = "401";
      obj.message = "Already registerd...Go for login";
      res.send(obj);
      logApi(req, obj);
    }
  });
});

//--getUserInfo Route--
router.route('/api/getUserInfo.json').all(function (req, res) {
  var obj = {};
  if(req.session.name == null) {
    obj.status = "200";
    obj.message = "User is not logged in";
    res.send(obj);                
    logApi(req, obj);
    return;
  }
  obj.status = "200";
  obj.message = req.session.name;
  res.send(obj);
  logApi(req, obj);
})

//--createTimeTable Route--
router.route('/api/createTimeTable.json').all(function (req, res) {
  var obj = {};
  connection.beginTransaction(function (err) {
    if (err) {
      obj.status = "469";
      obj.message = "SQL Transaction Creation Failed: " + err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    connection.query("INSERT INTO college.time_schedule VALUES('" + req.query.time_schedule_name + "','CCP','10:30', 6, 60, 20,'" + req.session.email + "');");

    connection.query("INSERT INTO college.working_days VALUES('MON','full','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.working_days VALUES('TUE','full','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.working_days VALUES('WED','full','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.working_days VALUES('THU','full','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.working_days VALUES('FRI','full','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.working_days VALUES('SAT','half','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.working_days VALUES('SUN','none','" + req.query.time_schedule_name + "');");

    connection.query("INSERT INTO college.sem VALUES('IV','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.sem VALUES('VI','" + req.query.time_schedule_name + "');");

    connection.query("INSERT INTO college.subject VALUES(null,'Networking','IV',3,0,1,'"+btoa(JSON.stringify([[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true]]))+"','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.subject VALUES(null,'Microprocessor','IV',3,0,1,'"+btoa(JSON.stringify([[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true]]))+"','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.subject VALUES(null,'Microprocessor Lab','IV',3,1,1,'"+btoa(JSON.stringify([[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true]]))+"','" + req.query.time_schedule_name + "');");

    connection.query("INSERT INTO college.teacher VALUES(null,'G.D.',6,'"+btoa(JSON.stringify([[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true]]))+"','" + req.query.time_schedule_name + "');");
    connection.query("INSERT INTO college.teacher VALUES(null,'B.K.',6,'"+btoa(JSON.stringify([[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true,true,true,true],[true,true,true]]))+"','" + req.query.time_schedule_name + "');");
    connection.commit(function (err) {
      if (err) {
        return connection.rollback(function () {
          obj.status = "469";
          obj.message = "SQL Transaction Commit Failed: " + err.sqlMessage;
          res.send(obj);
          logApi(req, obj);
          //throw err;
        });
      }
      obj.status = "200";
      obj.message = "Successfully entered!!";
      res.send(obj);
      logApi(req, obj);
    });
  });
});

//--getTimeTables Route--
router.route('/api/getTimeTables.json').all(function (req, res) {
  var sql = "SELECT time_schedule_name,ins_name FROM college.time_schedule WHERE fk_email='" + req.session.email + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.length == 0) {
      obj.status = "404";
      obj.name = req.session.name;
      obj.message = "User does not have any time tables";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully retrieved";
    obj.name = req.session.name;
    obj.list = result;
    res.send(obj);
    logApi(req, obj);
  });
});

//--updateTimeTable Route--
router.route('/api/updateTimeTable.json').all(function (req, res) {
  var obj = {};
  var sql = "UPDATE college.time_schedule SET ins_name='" + req.query.ins_name + "',start_time='" + req.query.start_time + "',slot_count='" + req.query.slot_count + "',slot_duration_mins='" + req.query.slot_duration_mins + "',recess_duration='" + req.query.recess_duration + "' WHERE time_schedule_name='" + req.query.time_schedule_name + "';"
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    obj.status = "200";
    obj.message = "Successfully updated!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--getTimeTable Route--
router.route('/api/getTimeTable.json').all(function (req, res) {
  var sql = "SELECT * FROM college.time_schedule WHERE time_schedule_name='" + req.query.time_schedule_name + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.length == 0) {
      obj.status = "404";
      obj.message = "Timetable data with given name not found.";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully retrieved";
    obj.time_schedule_name = result[0].time_schedule_name;
    obj.ins_name = result[0].ins_name;
    obj.start_time = result[0].start_time;
    obj.slot_count = result[0].slot_count;
    obj.slot_duration_mins = result[0].slot_duration_mins;
    obj.recess_duration = result[0].recess_duration;
    //obj.arr = [
    //  [result[0].ins_name, result[0].start_time]
    //];
    res.send(obj);
    logApi(req, obj);
  });
});

//--getWorkingDays Route--
router.route('/api/getWorkingDays.json').all(function (req, res) {
  var sql = "SELECT * FROM college.working_days WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "User has no working days!";
      obj.list = result;
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = result;
    res.send(obj);
    logApi(req, obj);
  });
});

//--updateWorkingDay Route--
router.route('/api/updateWorkingDay.json').all(function (req, res) {
  var obj = {};
  var sql = "UPDATE college.working_days SET full_half='" + req.query.full_half + "' WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "' and days_name='" + req.query.days_name + "';"
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "Day with given days_name not found in database.";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully updated!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--updateSem Route--
router.route('/api/updateSem.json').all(function (req, res) {
  var obj = {};
  let list = JSON.parse("[" + req.query.list + "]");

 /* connection.query("DELETE FROM college.sem WHERE fk_time_schedule_name = '" + req.query.time_schedule_name + "';", function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = "Delete All Rows Failed: " + err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
  });*/
  connection.query("SELECT sem_no FROM college.sem WHERE fk_time_schedule_name = '" + req.query.time_schedule_name + "';",function(err,result){
    if (err) {
      obj.status = "469";
      obj.message = "Delete All Rows Failed: " + err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    else{
     
      for(var i=0;i<result.length;i++){
        var isInNewSem= false;
        for(var j=0; j<list.length;j++){
          if(result[i].sem_no==list[j]){
            isInNewSem =true;break;
          }
          
        }
        if(!isInNewSem){
          console.log(i);
          connection.query("DELETE FROM college.sem WHERE sem_no='"+result[i].sem_no+"' AND fk_time_schedule_name='"+req.query.time_schedule_name+"';")
        }
      }
    }
    for(var i=0;i<list.length;i++){
      var isInDb= false;

      for(var j=0; j<result.length;j++){
        if(result[j].sem_no==list[i]){
          isInDb =true;break;
        }
        
      }
      if(!isInDb){
        console.log(i);
        connection.query("INSERT INTO college.sem VALUES('" + list[i] + "','" + req.query.time_schedule_name + "');")
      }
    }
    obj.status = "200";
      obj.message = "Successfully updated!!";
      res.send(obj);
      logApi(req, obj);
  })
 /* connection.beginTransaction(function (err) {
    if (err) {
      console.log(err);
      obj.status = "469";
      obj.message = "Begin Transaction Failed: " + err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    
    for (var i = 0; i < list.length; i++) {
      connection.query("INSERT INTO college.sem VALUES('" + list[i] + "','" + req.query.time_schedule_name + "');");
    }
    connection.commit(function (err) {
      if (err) {
        return connection.rollback(function () {
          obj.status = "469";
          obj.message = "Commit Transaction Failed: " + err.sqlMessage;
          res.send(obj);
          logApi(req, obj);
          return;
          throw err;
        });
      }
      obj.status = "200";
      obj.message = "Successfully updated!!";
      res.send(obj);
      logApi(req, obj);
    });
  });*/

});
//--getSems Route--
router.route('/api/getSems.json').all(function (req, res) {
  var sql = "SELECT * FROM college.sem WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "User has not created any semisters";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully retrieved";
    obj.list = result;
    res.send(obj);
    logApi(req, obj);
  });
});

//--getSubjects Route--
router.route('/api/getSubjects.json').all(function (req, res) {
  var sql = "SELECT * FROM college.subject WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "User does not have any subjects";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully Retrieved";
    obj.list = result;
    res.send(obj);
    logApi(req, obj);
  });
});

//--addSubject Route--
router.route('/api/addSubject.json').all(function (req, res) {
  var obj = {};
  var sql = "INSERT INTO college.subject VALUES(null,'" + req.query.sub_name + "','" + req.query.fk_sem_no + "','" + req.query.hrs_per_week + "','" + req.query.lab_or_not + "','" + req.query.min_slot_length + "','" + req.query.slot_pref + "','" + req.query.time_schedule_name + "');"
  connection.query(sql, function (err, result) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    obj.status = "200";
    obj.message = "Successfully added!!!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--updateSubject Route--
router.route('/api/updateSubject.json').all(function (req, res) {
  var obj = {};
  var sql = "UPDATE college.subject SET sub_name='" + req.query.sub_name + "', fk_sem_no='" + req.query.fk_sem_no + "', hrs_per_week='" + req.query.hrs_per_week + "' , lab_or_not='" + req.query.lab_or_not + "',min_slot_length='" + req.query.min_slot_length + "', slot_pref='" + req.query.slot_pref + "' WHERE sub_id='" + req.query.sub_id + "' and fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "Subject with given time table name and id not found.";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully updated!!!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--deleteSubject Route--
router.route('/api/deleteSubject.json').all(function (req, res) {
  var obj = {};
  var sql = "DELETE FROM college.subject WHERE sub_id='" + req.query.sub_id + "' and fk_time_schedule_name='" + req.query.time_schedule_name + "';";
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "Error! The row with given subject id not found.";
      res.send(obj);
      logApi(req, obj);
      return
    }
    obj.status = "200";
    obj.message = "Successfully deleted!!!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--getTeachers Route--
router.route('/api/getTeachers.json').all(function (req, res) {
  var sql = "SELECT * FROM college.teacher WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "No teachers for given timetable found";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully Retrieved";//it is giving teacher with no sem...plz fix this error
    obj.list = result;                     //sem no is eaither null or undefined.......even when teachers input there semno before
    res.send(obj);
    logApi(req, obj);
  });
});

//--addTeacher Route--
router.route('/api/addTeacher.json').all(function (req, res) {
  var obj = {};
  req.query.max_continuois_period = 5;
  var sql = "INSERT INTO college.teacher VALUES(null,'" + req.query.tr_name + "','" + req.query.max_continuois_period + "','" + req.query.time_matrix + "','" + req.query.time_schedule_name + "');"
  connection.query(sql, function (err, result) {
    if (err) {
      obj.status = "401";
      obj.message = "Error occurred!!";
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    obj.status = "200";
    obj.message = "Successfully added!!!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--updateTeacher Route--
router.route('/api/updateTeacher.json').all(function (req, res) {
  var obj = {};
  req.query.max_continuois_period = 5;
  var sql = "UPDATE college.teacher SET tr_name='" + req.query.tr_name + "', max_continuois_period='" + req.query.max_continuois_period + "', time_matrix='" + req.query.time_matrix + "' WHERE tr_id='" + req.query.tr_id + "' and fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "Given Teacher with Teacher Id and column name not found.";
      res.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully updated!!!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--deleteTeacher Route--
router.route('/api/deleteTeacher.json').all(function (req, res) {
  var obj = {};
  var sql = "DELETE FROM college.teacher WHERE tr_id='" + req.query.tr_id + "' and fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    if (result.affectedRows == 0) {
      obj.status = "401";
      obj.message = "Given Teacher with Teacher Id and column name not found.";
      obj.send(obj);
      logApi(req, obj);
      return;
    }
    obj.status = "200";
    obj.message = "Successfully deleted!!!";
    res.send(obj);
    logApi(req, obj);
  });
});

//--getSubTeach Route--
router.route('/api/getSubTeach.json').all(function (req, res) {
  var sql = "SELECT fk_time_schedule_name,fk_sub_id,fk_tr_id FROM college.sub_teacher WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  var obj = {};
  connection.query(sql, function (err, result, fields) {
    if (err) {
      obj.status = "469";
      obj.message = err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    obj.status = "200";
    obj.message = "Successfully Retrieved";
    obj.list = [];
    for (var i = 0; i < result.length; i++) {

      obj.list.push([result[i].fk_sub_id, result[i].fk_tr_id]);
    }
    res.send(obj);
    logApi(req, obj);
  });
});

//--updateSubTeach Route--
/* router.route('/api/updateSubTeach.json').all(function (req, res) {
  var obj7 = {};
  var sql = "SELECT fk_time_schedule_name FROM college.sub_teacher WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';"
  connection.query(sql, function (err, result, fields) {
    if (err) {
      throw err
    } else {
      console.log(result);
      if (result.affectedRows == 0) {
        for (var i = 0; i < result.length; i++) {
          connection.query("INSERT INTO college.sub_teacher VALUES('" + req.query.list[i][0] + "','" + req.query.list[i][1] + "','" + req.query.time_schedule_name + "');", function (err) {
            if (err)
              throw err
          })
        }
        obj7.status = "200";
        obj7.message = "Successfully updated!!!";
        res.send(obj7);
      } else {
        connection.query("DELETE FROM college.sub_teacher WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';", function (err) {
          if (err)
            throw err
        })
        for (var i = 0; i < result.length; i++) {
          connection.query("INSERT INTO college.sub_teacher VALUES('" + req.query.list[i][0] + "','" + req.query.list[i][1] + "','" + req.query.time_schedule_name + "');", function (err) {
            if (err)
              throw err
          })
        }
        obj7.status = "200";
        obj7.message = "Successfully updated!!!";
        res.send(obj7);
      }
    }
  });
}); */
router.route('/api/updateSubTeach.json').all(function (req, res) {
  var obj = {};
  obj.status = "200";
  connection.beginTransaction(function (err) {
    if (err) {
      obj.status = "469";
      obj.message = "Begin Transaction Failed: " + err.sqlMessage;
      res.send(obj);
      logApi(req, obj);
      return;
      throw err;
    }
    connection.query("DELETE FROM college.sub_teacher WHERE fk_time_schedule_name='" + req.query.time_schedule_name + "';", function (err, result, fields) {
      if (err) {
        obj.status = "469";
        obj.message = "Delete All Rows Failed: " + err.sqlMessage;
      }
    });  
    let list = JSON.parse(req.query.list);
    for (var i = 0; i < list.length; i++) {
      connection.query("INSERT INTO college.sub_teacher VALUES('" + list[i][0] + "','" + list[i][1] + "','" + req.query.time_schedule_name + "');", function (err, result, fields) {
        if (err) {
          obj.status = "402";
          obj.message = "Failed to insert a tuple cuz of" + err.sqlMessage;
        }
      });
    }
    connection.commit(function (err) {
      if (err) {
        obj.status = "469";
        obj.message = "Commit Transaction Failed: " + err.sqlMessage;
      }
      if(obj.status != "200") {
        res.send(obj);
        logApi(req, obj);
        connection.rollback(function(e){});
        return;
      }
      obj.status = "200";
      obj.message = "Successfully updated!!";
      res.send(obj);
      logApi(req, obj);
    });
  });
});

//--generateTimeTable Route--
router.route('/api/generateTimeTable.json').all(function (req, res) {
  req.setTimeout(100000);
  var obj = {};
  connection.beginTransaction(function (err) {
    if (err) {
      res.send(obj = {status: "469",message:"Begin Transaction Failed: " + err.sqlMessage,result: null});
      logApi(req, obj);
      return;
      throw err;
    }
    connection.query("SELECT ins_name, slot_count FROM college.time_schedule WHERE time_schedule_name ='" + req.query.time_schedule_name + "';", function (err, result, fields) {
      if (err) {
        res.send(obj = {status: "469",message:"Get Time Schedule Failed: " + err.sqlMessage,result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      if (result.length == 0) throw err;
      gen.slot_count = Number(result[0].slot_count);
      gen.slot_count_half = Math.floor(gen.slot_count/2);
    });

    connection.query("SELECT sem_no FROM college.sem WHERE fk_time_schedule_name ='" + req.query.time_schedule_name + "';", function (err, result, fields) {
      if (err) {
        res.send(obj = {status: "469",message:"Get Sem Failed: " + err.sqlMessage,result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      if (result.length == 0) throw err;
      gen.sem = [];
      result.forEach(elem => {
        gen.sem.push(elem.sem_no);
      });
    });

    connection.query("SELECT * FROM college.working_days WHERE fk_time_schedule_name ='" + req.query.time_schedule_name + "';", function (err, result, fields) {
      if (err) {
        res.send(obj = {status: "469",message:"Get Working Days Failed: " + err.sqlMessage,result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      if (result.length == 0) throw err;
      gen.days = [];
      result = [1, 5, 6, 4, 0, 2, 3].map(i => result[i]);
      result.forEach(elem => {
        if (elem.full_half == "full") {
          gen.days.push(new gen.Day(elem.days_name, true));
        } else if (elem.full_half == "half") {
          gen.days.push(new gen.Day(elem.days_name, false));
        }
      });
    });

    connection.query("SELECT * FROM college.subject WHERE fk_time_schedule_name ='" + req.query.time_schedule_name + "';", function (err, result, fields) {
      if (err) {
        res.send(obj = {status: "469",message:"Get Sub Failed: " + err.sqlMessage,result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      if (result.length == 0) throw err;
      gen.sub = [];
      result.forEach(elem => {
        gen.sub.push(new gen.Sub(elem.sub_id, elem.sub_name, elem.fk_sem_no, Number(elem.hrs_per_week), Boolean(Number(elem.lab_or_not)), JSON.parse(atob(elem.slot_pref)), Number(elem.min_slot_length)));
      });
    });

    connection.query("SELECT * FROM college.teacher WHERE fk_time_schedule_name ='" + req.query.time_schedule_name + "';", function (err, result, fields) {
      if (err) {
        res.send(obj = {status: "469",message:"Get Teacher Failed: " + err.sqlMessage,result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      if (result.length == 0) throw err;
      gen.teach = [];
      result.forEach(elem => {
        gen.teach.push(new gen.Teach(elem.tr_id, elem.tr_name, elem.max_continuois_period, JSON.parse(atob(elem.time_matrix))));
      });
    });

    connection.query("SELECT * FROM college.sub_teacher WHERE fk_time_schedule_name ='" + req.query.time_schedule_name + "';", function (err, result, fields) {
      if (err) {
        res.send(obj = {status: "469",message:"Get SubTeach Failed: " + err.sqlMessage,result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      //if (result.length == 0) throw err;
      gen.subTeach = [];
      result.forEach(elem => {
        gen.subTeach.push([elem.fk_sub_id, elem.fk_tr_id]);
      });
    });
    connection.commit(function (err) {
      if (err) {
        res.send(obj = {status: "469",message:"Commit Failed: " + err.sqlMessage,result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      // console.log(gen.sem);
      // console.log(gen.days);
      //console.log(gen.sub);
      // console.log(gen.teach);
      // console.log(gen.subTeach);
      gen.generate();
      let resultArr = gen.getResultArr();
      if(typeof resultArr == "undefined" || resultArr == null) {
        res.send(obj = {status: "400",message:"Cannot create timetable using given input. Please try changing the input",result: null});
        logApi(req, obj);
        return;
        throw err;
      }
      res.send(obj = {status: "200",result: resultArr});
      logApi(req, obj);
    });
  });
});
module.exports = router;
//see line ..................................120 and 512
