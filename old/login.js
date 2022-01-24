router.route('/api/addSubject.json').all(function (req, res) {
  var obj11 = {};
  var sql="INSERT INTO college.subject VALUES(null,'"+req.query.sub_name+"','"+req.query.sem_no+"','"+req.query.hrs_per_week+"','"+req.query.lab_or_not+"','"+req.query.min_slot_length+"','"+req.query.slot_pref+"','"+req.query.time_schedule_name+"');"
  connection.query(sql, function (err) {
   if (!err){
         obj11.status = "200";
         obj11.message = "Successfully added!!!";
         res.send(obj11);


     }
     else{    
    obj11.status = "401";
    obj11.message = "Error occurred!!";
    res.send(obj11);
     }

    })
});