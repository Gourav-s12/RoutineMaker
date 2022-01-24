var globat=0;
var fstTimet=0;
var fstteachid =0;
var id=0;
var subidarr=[];
var subnamearr=[];
var tridarr=[];
var dayday =[];
var maxconlen=0;

function deleteRow(r,sid) {
      var ure = myUpdatet(0);
      if(ure==false){
        return false;
      }
      var re = myDelTablet(sid);
      if (re== true){
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("myTable").deleteRow(i);
}
}
function myCreateFunctioxt(data) {
  var table = document.getElementById("myTable");
  var row = table.insertRow(1);
    row.id = id;
    console.log(row);
    id++;
  var cell1 = row.insertCell(0);
  //var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(1);
  var cell4 = row.insertCell(2);
  var cell5 = row.insertCell(3);
  
 
  cell1.innerHTML = '<p contenteditable="true" id="'+globat+'Name" style=" text-align:center;">'+data.tr_name+' </p><div id="'+globat+'Id">'+data.tr_id+'</div>';
  /*cell2.innerHTML = '<p contenteditable="true" id="'+globat+'Peri" style="text-align:center; border:0.5px solid white">'+data.max_continuois_period+' </p>';
   */
     cell3.innerHTML = '<div align=center> <button type="button" data-toggle="modal" data-target="#myModal'+globat+'" class="btn btn-outline-success">Edit  </button> </div>                         <div class="modal fade" id="myModal'+globat+'"><div class="modal-dialog"><div class="modal-content"><!-- Modal Header --><div class="modal-header"><h4 class="modal-title">Slot preference</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div><!-- Modal body --><div class="modal-body"><table><tr><td style="text-align: center">Monday </td><td id="t0r'+globat+'"></td></tr><tr><td style="text-align: center">Tuesday </td><td id="t1r'+globat+'"></td></tr><tr><td style="text-align: center">Wednesday </td><td id="t2r'+globat+'"></td></tr><tr><td style="text-align: center">Thursday  </td><td id="t3r'+globat+'"></td></tr><tr><td style="text-align: center">Friday </td><td id="t4r'+globat+'"></td></tr><tr><td style="text-align: center">Saturday </td><td id="t5r'+globat+'"></td></tr><tr><td style="text-align: center">Sunday </td><td id="t6r'+globat+'"></td></tr></table></div> <!-- Modal footer --><div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Ok</button><button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button></div></div></div</div>';
        cell4.innerHTML = '<div align=center><button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#exampleModal'+globat+'" align=right> Edit </button></div>                  <div class="modal fade" id="exampleModal'+globat+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Modal title</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"> ... <table style="  float: left" id="ta'+globat+'"> </table></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button></div></div></div></div> ';
        cell5.innerHTML = '<input type="button" value="Delete"  class="btn btn-outline-danger" onclick="deleteRow(this,'+data.tr_id+')" align=right>';
        maketrsub(globat,data.tr_id);
        //myslotget(data.tr_id,data.time_matrix);
        $("#".concat(globat+'Id')).hide();
        globat++;
        console.log(globat);
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  }

 function myGetTablet(){
        if(fstTimet==0){
          myGetslot();
          mySubarr();
        }
        fstTimet++;
         setTimeout(() => { 
 var timet = getUrlVars()["time_schedule_name"];
       var parameters ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getTeachers.json"+parameters )
      .done(function(data) {
        //obj.list=[{tr_id:1,tr_name:"BR",max_continuois_period:4,time_matrix:"..Time Matirx.."},{tr_id:2,tr_name:"SH",max_continuois_period:4,time_matrix:"..Time Matirx.."}....]
      if(data.status == 200 ){
         if(data.list.length >= 1){
              document.getElementById("fstteach").innerHTML=data.list[0].tr_name;
              /*document.getElementById("fstteachperi").innerHTML=data.list[0].max_continuois_period;*/
              //document.getElementById("fstSem").innerHTML=data.list[0].fk_sem_no;
              fstteachid = data.list[0].tr_id;
              tridarr[tridarr.length]=data.list[0].tr_id;
              maketrsub("fst",data.list[0].tr_id);
              //myslotget(data.list[0].tr_id,data.list[0].time_matrix);

              for(var i=1;i<data.list.length;i++){
                tridarr[tridarr.length]=data.list[i].tr_id;
                myCreateFunctioxt(data.list[i]);
              }
              mySlotcountFunction(dayday);
                getsubtr();
               for(var i=0;i<data.list.length;i++){
                myslotget(data.list[i].tr_id,data.list[i].time_matrix);

              } 
          }else if(data.list.length == 0){
          }

          }else{
            alert(data.message);
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
  }, 500);
      } 
    function myAddTablet(){
 var timet = getUrlVars()["time_schedule_name"];
  timet= myhaserror(timet);
       var parameters ='?time_schedule_name='+timet+'&tr_name=BR&time_matrix=..Time Matirx..' ;//remove
       console.log(parameters);
      $.ajax( "http://localhost:8086/api/addTeacher.json"+parameters )
      .done(function(data) {
        //addSubject.json?time_schedule_name=TimeTable1&sub_name="Java"&fk_sem_no=IV&hrs_per_week=5&lab_or_not=true&min_slot_length=1&slot_pref:"...Slot Pref..."
      if(data.status == 200 ){
                delrow();
               myGetTablet();
          }else{
            alert(data.message);
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
      } 
      function delrow(){
        console.log("hello");
        console.log(globat);
        console.log(id);
        //document.getElementById("writertt24t")="";
       for(var b =0;b<(globat) ;b++){             // var getx = document.getElementById('"'+i+'"');
             document.getElementById("myTable").deleteRow(1);
        }
        globat=0;
        tridarr.length=0;
      }
function myDelTablet(id){
 var timet = getUrlVars()["time_schedule_name"];
  timet= myhaserror(timet);
       var parameters ='?time_schedule_name='+timet+'&tr_id='+id+'' ;
       console.log(parameters);
      $.ajax( "http://localhost:8086/api/deleteTeacher.json"+parameters )
      .done(function(data) {
        //deleteTeacher.json?time_schedule_name=TimeTable1&tr_id=1
                //document.getElementById("tablerows").innerHTML ="";
                //myGetTable();
        //alert(data.message);
      if(data.status == 200 ){
                 delrow();
               myGetTablet();
        return true;
          }else{
            alert(data.message);
            return false;
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
      } 
//for slot pref
    function myGetslot(){
      var timet = getUrlVars()["time_schedule_name"];
      var slotCount = 0;
      var getdayfh = [1,2,3,4,5,6,7];
      var dayarr =[5,1,6,7,4,2,3];
       var parameters1 ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getTimeTable.json"+parameters1 )
      .done(function(data) {
      if(data.status == 200 ){
        //obj.time_schedule_name, obj.ins_name, obj.start_time, obj.slot_count, obj.recess_duration
        slotCount = data.slot_count;
        maxconlen=slotCount;
      }else{
            alert("try again");
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
       var parameters2 ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getWorkingDays.json"+parameters2 )
      .done(function(data) {
      if(data.status == 200 ){
        
          for(var i=0;i<7;i++){
            if(data.message[i].full_half=="full"){
          getdayfh[dayarr[i]-1] = slotCount;
            }else if(data.message[i].full_half=="half"){
          getdayfh[dayarr[i]-1] = (slotCount/2);
            }else if(data.message[i].full_half=="none"){
          getdayfh[dayarr[i]-1] = 0;
            }
           }
           console.log(getdayfh);
           dayday = getdayfh;
           
          }else{
            alert("enter and try again");
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })   

    }
    function aa(k,id){
  document.getElementById("t"+id).innerHTML = "";
for (var i = 0; i < k; i++) {
    document.getElementById("t"+id).innerHTML  += '<td style="text-align: center"><input type="checkbox" id="'+fstteachid+'d'+id+'s'+i+'" checked></td>';
}
//document.getElementById("t"+id).innerHTML =text;
for (var i = 0; i < globat; i++) {
   document.getElementById("t"+id+"r"+i).innerHTML  = "";
   var tid =document.getElementById(i+"Id").innerHTML;
    for (var j = 0; j < k; j++) {
    document.getElementById("t"+id+"r"+i).innerHTML  += '<td style="text-align: center"><input type="checkbox" id="'+tid+'d'+id+'s'+j+'" checked></td>';
    }
    //document.getElementById("t"+id+"r"+i).innerHTML =text;
}
}
function mySlotcountFunction(myarray) {
  var t=0;
for (var i = 0; i < myarray.length; i++) {
  aa(Math.floor(myarray[t]),t);
  
  t++;
}}
function myUpdatet(vari){
var u=0;
  var timet = getUrlVars()["time_schedule_name"];
            for(var i=0;i<(globat+1);i++){
            for(var j=0;j<i ;j++){
                
                if(i==globat){
                  var getiname = document.getElementById("fstteach").innerHTML;
                }else{
                  var getiname = document.getElementById(i+"Name").innerHTML;
                }
                var getjname = document.getElementById(j+"Name").innerHTML;
               // var getilab= document.querySelector('input[name="r'+i+'"]:checked');
               // var getjlab= document.querySelector('input[name="r'+j+'"]:checked');
               console.log(getjname);
               console.log(getiname);
               console.log(getiname==getjname);
              if(getiname==getjname){
                  document.getElementById("writertt24t").innerHTML="name should be unique";
                  return false;
              }
            }
            /*if(i==globat){u="fstteachperi";}else{u=i+"Peri";}
             if((document.getElementById(u).innerHTML<0)&&(document.getElementById(u).innerHTML>maxconlen)){
              console.log("oo");
              document.getElementById("writertt24t").innerHTML="Continous Period value must be greater than 0 and less than "+maxconlen;
              return false;
            }*/
          }
           //return false;	//Shouldn't this be removed, Gaurav??//ya ....it is here for testing the upper part
           u=0;
            console.log("all ok");
            var uuire = myUpdateTeach("fst");
              if(uuire==false){
              return false;
               }
            for(var i=0;i<globat;i++){
              var uure = myUpdateTeach(i);
              if(uure==false){
              return false;
               }

            }
            //updatesubtr();
            var uuist = updatesubtr();
              if(uuist==false){
              return false;
               }
               //return true;
            setTimeout(() => { 
            if(vari==1){
              //return false;
             console.log("Successfully updated!!!");
              window.location="/output.html?time_schedule_name="+timet+"";
            }
            console.log("done"); }, 2000);
           // writerarr+=+'&days_name='+day ;

}
function myhaserror(str){
    var res = str.charAt(str.length-1);
    if(res=="#"){
      str = str.substring(0, str.length - 1);
      return str;    }
      return str;
 }
function myUpdateTeach(count){

var timet = getUrlVars()["time_schedule_name"];
  timet= myhaserror(timet);
  document.getElementById("writertt24t").innerHTML=""; 
  
if(count=="fst"){
      var uname= document.getElementById("fstteach").innerHTML;
      var uid= fstteachid;
      //var uperi= 5;//document.getElementById("fstteachperi").innerHTML;
     var slotpe= myslotstr(uid);
      var parameters ='?time_schedule_name='+timet+'&tr_id='+uid+'&tr_name='+uname+'&time_matrix='+slotpe ;//remove
}else{
      
      var uname= document.getElementById(count+"Name").innerHTML;
      var uid= document.getElementById(count+"Id").innerHTML;
      //var uperi= 5;//document.getElementById(count+"Peri").innerHTML;
     var slotpe= myslotstr(uid);
      var parameters ='?time_schedule_name='+timet+'&tr_id='+uid+'&tr_name='+uname+'&time_matrix='+slotpe ;//remove
      }
       //updateTeacher.json?time_schedule_name=TimeTable1&tr_id=1&tr_name="BR"&max_continuois_period=4&time_matrix="..Time Matirx.."
       if((uname=="")||(uname==null)){
        document.getElementById("writertt24t").innerHTML="please enter all fields";
        return false;
}
      //console.log("start");
      //console.log(slotpe);
      console.log(parameters);
      //return false;
      $.ajax( "http://localhost:8086/api/updateTeacher.json"+parameters )
      .done(function(data) {
      if(data.status == 200 ){
        //window.location=".html";
        console.log(data.message);
        return true;
          }else{
            alert("try again");
            return false;
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  }) 

}
function mybacket(){
  var timet = getUrlVars()["time_schedule_name"];
        timet= myhaserror(timet);
        window.location="/sub.html?time_schedule_name="+timet+"";
}
//for edit sub
function mySubarr(){
 var timet = getUrlVars()["time_schedule_name"];
 timet= myhaserror(timet);
       var parameters ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getSubjects.json"+parameters )
      .done(function(data) {
        //obj.list=[{sub_id:1,sub_name:"Java",fk_sem_no:"IV",hrs_per_week:5,lab_or_not:true,min_slot_length:1,slot_pref:"..Slot Pref.."},{sub_id:1,sub_name:"Java",fk_sem_no:"IV",hrs_per_week:5,lab_or_not:true,min_slot_length:1,slot_pref:"..Slot Pref.."}....] 
      if(data.status == 200 ){
        for(var i=0;i<data.list.length;i++){
          subidarr[subidarr.length]=data.list[i].sub_id;
          subnamearr[subnamearr.length]=data.list[i].sub_name+"("+data.list[i].fk_sem_no+")";
        }
        console.log(subnamearr);
        console.log(subidarr);
              }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
      } 
    function maketrsub(data,tid){
      console.log(subnamearr);
      if(data=="fst"){
         document.getElementById("fsttrsub").innerHTML="";
      }
      for(var i=0;i<(subnamearr.length);i++){
        if(data=="fst"){
          console.log("here");
        document.getElementById("fsttrsub").innerHTML+='<tr><td style="text-align: center">'+subnamearr[i]+' </td><td style="text-align: center"><input type="checkbox" id="su'+subidarr[i]+'tr'+tid+'"></td></tr>';
      }else{
        console.log("there");
        document.getElementById("ta"+globat).innerHTML+='<tr><td style="text-align: center">'+subnamearr[i]+' </td><td style="text-align: center"><input type="checkbox" id="su'+subidarr[i]+'tr'+tid+'"></td></tr>';
      }
      }
    }
    function getsubtr(){
      //getSubTeach.json?time_schedule_name=TimeTable1
      var timet = getUrlVars()["time_schedule_name"];
      timet= myhaserror(timet);
       var parameters ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getSubTeach.json"+parameters )
      .done(function(data) {
        
      if(data.status == 200 ){
            for (var i = 0; i < (data.list.length); i++) {
                 //myArray[i][1]  = "assets/scrybe.jpg";
                 console.log("su"+data.list[i][0]+"tr"+data.list[i][1]);
                 document.getElementById("su"+data.list[i][0]+"tr"+data.list[i][1]).checked = true;
            }

        }else{
          alert(data.message);
        }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
    }
    function updatesubtr(){
      var trsend=[];
      var subsend=[];
      for(var i=0;i<(subidarr.length);i++){
          for(var j=0;j<(tridarr.length);j++){
          var x = document.getElementById("su"+subidarr[i]+"tr"+tridarr[j]).checked;
          if(x==true){
           trsend[trsend.length]=tridarr[j];
           subsend[subsend.length]=subidarr[i];
          }
      }
      }
      console.log(trsend);
      console.log(subsend);
      var mysendarr = [];
      for(var i=0;i<subsend.length;i++){
        mysendarr.push(new Array(2));
      }
      for(var i=0;i<subsend.length;i++){
       mysendarr[i][0]=subsend[i];
        mysendarr[i][1]=trsend[i];
      }
      var timet = getUrlVars()["time_schedule_name"];
      timet= myhaserror(timet);
      console.log(mysendarr);
      //return true;//gotta remove this after testing
       var parameters ='?time_schedule_name='+timet+'&list='+JSON. stringify(mysendarr);
       //updateSubTeach.json?list=[[1,2][2,1],[1,3]]
      $.ajax( "http://localhost:8086/api/updateSubTeach.json"+parameters )
      .done(function(data) {
        console.log("updated subtr");
      if(data.status == 200 ){
            

        }else{
          alert(data.message);
          return false;
        }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
    }
function myslotstr(uid){
  var myslotarr = [];
      for(var i=0;i<dayday.length;i++){
        myslotarr.push(new Array(Math.floor(dayday[i])));
      }
      for(var i=0;i<myslotarr.length;i++){
       for(var j=0;j<Math.floor(dayday[i]);j++){
       var x = document.getElementById(uid+"d"+i+"s"+j).checked;//"'+tid+'d'+id+'s'+j+'"//id="'+tid+'d'+id+'s'+j+'"
          if(x==true){
           myslotarr[i][j]=true;
          }else{
            myslotarr[i][j]=false;
          }

      }
      }

      var str=btoa(JSON.stringify(myslotarr));
      if(str==null){
        myslotarr="..Time Matirx..";
      }
      return str;
}
function myslotget(tid,str){
      console.log(str);
      if((str=="..slot pref..")||(str== null)||(str== undefined)||(str== "undefined")){
        return false;
      }
      try{
      var myslotarr=JSON.parse(atob(str));
    }catch(err){
      return false;
    }
      console.log(myslotarr);
      for(var i=0;i<(myslotarr.length);i++){
       for(var j=0;j<(myslotarr[i].length);j++){
          if(myslotarr[i][j]==false){
            document.getElementById(tid+"d"+i+"s"+j).checked = false;
            // document.getElementById(uid+"d"+i+"tr"+j).checked;
          }

      }
      }
}
// remove maxconlen at 102,297,304