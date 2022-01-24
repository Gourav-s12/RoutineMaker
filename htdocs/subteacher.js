var fstSubid = 0;
var semarr = [];
var globel =0;
var fstTime =0;
var j=0;
var dayday =[];
var maxslotlen=0;
     function deleteRow(r,sid) {
      var ure = myUpdate(0);
      if(ure==false){
        return false;
      }
      var re = myDelTable(sid);
      if (re== true){
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("myTable").deleteRow(i);
}
}
/*function deleteRow(r) {
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("myTable").deleteRow(i);
}*/
function myCreateFunction() {
        var ure = myUpdate(0);
      if(ure==false){
        return false;
      }
  var table = document.getElementById("myTable");
  var row = table.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  console.log(cell1);
  cell1.innerHTML = '<p contenteditable="true" id="'+ globel+'Name" style=" text-align:center;">java</p>';
  cell2.innerHTML = '<p contenteditable="true" id="'+ globel+'Hrs" style=" text-align:center;">2</p>';
   cell3.innerHTML = '<div align=center><td style="text-align: center"><input type=radio value="true" name="r'+ globel+'" id="'+ globel+'lab0000"> </td></div>';
    cell4.innerHTML = '<div align=center><input type=radio value="false" name="r'+ globel+'" id="'+ globel+'lab0001" checked style=" text-align:center;"> </div>';
     cell5.innerHTML = '<div align=center><button type="button"  class="btn btn-outline-success" data-toggle="modal" data-target="#myModal">Edit  </button></div>            ';
      cell6.innerHTML = '<p contenteditable="true" id="'+ globel+'Slot" style=" text-align:center;">2</p>';
       cell7.innerHTML = '<p contenteditable="true" id="'+ globel+'Sem" style=" text-align:center;">'+semarr[0]+'</p>';
        cell8.innerHTML = '<input type="button" value="Delete" onclick="deleteRow(this)" class="btn btn-outline-danger">';
        myAddTable();
        console.log(globel);
        globel++;
}
function gotIt(data){
    var result=false;
    if(data==0){
      result=1;
    }else if(data==1){
       result=0;
    }else{
      document.getElementById("writertt21").innerHTML="try again!";
    }
    return result;
  }
function myCreateFunctiox(data) {
  console.log(data);
  var table = document.getElementById("myTable");
  var row = table.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  cell1.innerHTML = '<p contenteditable="true" id="'+ globel+'Name" style=" text-align:center;">'+data.sub_name+'</p><div id="'+globel+'Id">'+data.sub_id+'</div>';
  cell2.innerHTML = '<p contenteditable="true" id="'+ globel+'Hrs" style=" text-align:center;">'+data.hrs_per_week+'</p>';
   cell3.innerHTML = '<div align=center><td style="text-align: center"><input type=radio value="true" name="r'+ globel+'" id="'+ globel+'lab0000" > </td></div>';
    cell4.innerHTML = '<div align=center><input type=radio value="false" name="r'+ globel+'" id="'+ globel+'lab0001" checked style=" text-align:center;"> </div>';
     cell5.innerHTML = '<div align=center><button type="button"  class="btn btn-outline-success" data-toggle="modal" data-target="#myModal'+ globel+'">Edit  </button></div>                <div class="modal fade" id="myModal'+ globel+'"><div class="modal-dialog"><div class="modal-content"><!-- Modal Header --><div class="modal-header"><h4 class="modal-title">Slot preference</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div><!-- Modal body --><div class="modal-body"><table><tr><td style="text-align: center">Monday </td><td><div id="t0s'+ globel+'">m</div></td></tr><tr><td style="text-align: center">Tuesday </td><td><div id="t1s'+ globel+'">t</div></td>  </tr><tr><td style="text-align: center">Wednesday </td><td ><div id="t2s'+ globel+'">w</div></td>  </tr><tr><td style="text-align: center">Thursday  </td><td ><div id="t3s'+ globel+'">t</div></td>  </tr><tr><td style="text-align: center">Friday </td><td ><div id="t4s'+ globel+'">f</div></td> </tr><tr><td style="text-align: center">Saturday </td><td><div id="t5s'+ globel+'">s</div></td>  </tr><tr><td style="text-align: center">Sunday </td><td><div id="t6s'+ globel+'">s</div></td></tr>  </table></div><!-- Modal footer --> <div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Ok</button>  <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button></div> </div> </div> </div> ';
      cell6.innerHTML = '<p contenteditable="true" id="'+ globel+'Slot" style=" text-align:center;">'+data.min_slot_length+'</p>';
       cell7.innerHTML = '<p contenteditable="true" id="'+globel+'Sem" style=" text-align:center;">'+data.fk_sem_no+'</p>';
        cell8.innerHTML = '<input type="button" value="Delete" onclick="deleteRow(this,'+data.sub_id+')" class="btn btn-outline-danger">';

        console.log(document.getElementById(globel+"Id").innerHTML);
        $("#".concat(globel+'Id')).hide();
       j=gotIt(data.lab_or_not);
              //document.getElementsByName("rll")[0].checked=true;
        document.getElementsByName("r"+globel)[j].checked=true;
       /* if(data.lab_or_not==true){
          document.getElementById("_".concat(globel+'0000')).checked =true;
        }else{
          document.getElementById("_".concat(globel+'0001')).checked =true;
        }*/
        console.log(globel);
        globel++;
    }
 function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  }

 function myGetTable(){
        if(fstTime==0){
          myGetslot();
            mySems();
        }
        fstTime++;
 var timet = getUrlVars()["time_schedule_name"];
       var parameters ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getSubjects.json"+parameters )
      .done(function(data) {
        //obj.list=[{sub_id:1,sub_name:"Java",fk_sem_no:"IV",hrs_per_week:5,lab_or_not:true,min_slot_length:1,slot_pref:"..Slot Pref.."},{sub_id:1,sub_name:"Java",fk_sem_no:"IV",hrs_per_week:5,lab_or_not:true,min_slot_length:1,slot_pref:"..Slot Pref.."}....] 
      if(data.status == 200 ){
         if(data.list.length >= 1){
            /*if((data.list[0].fk_sem_no=="")||(data.list[0].fk_sem_no==null)||(data.list[0].fk_sem_no==undefined)||(data.list[0].fk_sem_no=="undefined")){
              data.list[0].fk_sem_no=semarr[0];
            }*/
            console.log(data.list[0].fk_sem_no=semarr[0]);
              document.getElementById("fstName").innerHTML=data.list[0].sub_name;
              document.getElementById("fstHrs").innerHTML=data.list[0].hrs_per_week;
              console.log(data.list[0].fk_sem_no);
              if((data.list[0].fk_sem_no=="")||(data.list[0].fk_sem_no==null)||(data.list[0].fk_sem_no==undefined)||(data.list[0].fk_sem_no=="undefined")){
                   data.list[0].fk_sem_no=semarr[0];
               }
              document.getElementById("fstSem").innerHTML=data.list[0].fk_sem_no;
              document.getElementById("fstSlot").innerHTML=data.list[0].min_slot_length;
              fstSubid = data.list[0].sub_id;
              j=gotIt(data.list[0].lab_or_not);
              //document.getElementsByName("rll")[0].checked=true;
              document.getElementsByName("l2fst")[j].checked=true;
              /*if(data.list[0].lab_or_not==true){
              document.getElementById("_fstlab0000").checked =true;
            }else{
              document.getElementById("_fstlab0001").checked =true;
                }*/
              for(var i=1;i<data.list.length;i++){
                //console.log(data.list[i].fk_sem_no);

                if((data.list[i].fk_sem_no=="")||(data.list[i].fk_sem_no==null)||(data.list[i].fk_sem_no==undefined)||(data.list[i].fk_sem_no=="undefined")){
                   data.list[i].fk_sem_no=data.list[0].fk_sem_no;
                }
                myCreateFunctiox(data.list[i]);
              }
              mySlotcountFunction(dayday);
              for(var i=0;i<data.list.length;i++){
                myslotget(data.list[i].sub_id,data.list[i].slot_pref);
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
      } 
      function myAddTable(){
 var timet = getUrlVars()["time_schedule_name"];
   timet= myhaserror(timet);
       var parameters ='?time_schedule_name='+timet+'&sub_name=Java&fk_sem_no='+semarr[0]+'&hrs_per_week=2&lab_or_not=0&min_slot_length=1&slot_pref=..slot pref..' ;
       console.log(parameters);
      $.ajax( "http://localhost:8086/api/addSubject.json"+parameters )
      .done(function(data) {
        //addSubject.json?time_schedule_name=TimeTable1&sub_name="Java"&fk_sem_no=IV&hrs_per_week=5&lab_or_not=true&min_slot_length=1&slot_pref:"...Slot Pref..."
      if(data.status == 200 ){
                delrows();
               myGetTable();
          }else{
            alert(data.message);
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
      } 
      function delrows(){
        console.log("hello");
        console.log(globel);
        //document.getElementById("writertt24su")="";
       for(var b =0;b<(globel) ;b++){            
             document.getElementById("myTable").deleteRow(1);
        }
        globel=0;
      }
function myDelTable(id){
 var timet = getUrlVars()["time_schedule_name"];
  timet= myhaserror(timet);
       var parameters ='?time_schedule_name='+timet+'&sub_id='+id+'' ;
       console.log(parameters);
      $.ajax( "http://localhost:8086/api/deleteSubject.json"+parameters )
      .done(function(data) {
        //deleteSubject.json?time_schedule_name=TimeTable1&sub_id=1
      if(data.status == 200 ){
                delrows();
               myGetTable();
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
      function mySems(){
      var timet = getUrlVars()["time_schedule_name"];
       var parameters ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getSems.json"+parameters )
      .done(function(data) {
      if(data.status == 200 ){
        if(data.list.length >= 1){
              for(var i=0;i<data.list.length;i++){
                semarr[semarr.length] = data.list[i].sem_no ;
              }
              console.log(semarr);
          }else {
            document.getElementById("writertt24su").innerHTML="no sem error";
          }
          }else{
            alert(data.message);
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
      } 
function myUpdate(vari){


//var writerarr = "";
document.getElementById("writertt24su").innerHTML=""; 
   
            var timet = getUrlVars()["time_schedule_name"];
          timet= myhaserror(timet);
          for(var i=0;i<globel;i++){
             // var getx = document.getElementById('"'+i+'"');
             console.log(semarr);
             var k=0;
              var getx = document.getElementById(i+"Sem").innerHTML;
                for(;k< semarr.length;k++){
                  if(semarr[k]==getx){
                    break;
                  }
                }
                /*if(getx!=semarr[0]){
                  console.log("gg"+i+getx+semarr[0]);
                }*/
             if(k==semarr.length){
              //console.log("gg"+i+getx+semarr[0]);
               document.getElementById("writertt24su").innerHTML="wrong sem number";
              return false;
             }
             if((document.getElementById(i+"Slot").innerHTML==0)||(document.getElementById(i+"Hrs").innerHTML==0)){
              document.getElementById("writertt24su").innerHTML="Min Slot Length or hrs per week-can not be 0";
              return false;
             }
              if((document.getElementById(i+"Slot").innerHTML>maxslotlen)){
              document.getElementById("writertt24su").innerHTML="Min Slot Length or hrs per week-can not be 0";
              return false;
             }
             /*if((!document.getElementsByName("r'+i+'")[1].checked)&&(!document.getElementsByName("r'+i+'")[0].checked)){
              alert("please enter input in all fields");//document.getElementsByName("r'+i+'")[1].checked
             }*/
            }
            var getx = document.getElementById("fstSem").innerHTML;
                for(k=0;k< semarr.length;k++){
                  if(semarr[k]==getx){
                    break;
                  }
                }
             if(k==semarr.length){
               console.log("gg1");
              alert("wrong sem number")
              return false;
             }
             if((document.getElementById("fstSlot").innerHTML==0)||document.getElementById("fstHrs").innerHTML==0){
              document.getElementById("writertt24su").innerHTML="Min Slot Length or hrs per week-can not be 0";
              return false;
             }
              if((document.getElementById("fstSlot").innerHTML>maxslotlen)){
              document.getElementById("writertt24su").innerHTML="Min Slot Length -should be less then be "+maxslotlen;
              return false;
             }
            for(var i=0;i<(globel+1);i++){
            for(var j=0;j<i ;j++){
                if(i==globel){
                  var getiname = document.getElementById("fstName").innerHTML;
                  var getisem = document.getElementById("fstSem").innerHTML;
                }else{
                  var getisem = document.getElementById(i+"Sem").innerHTML;
                  var getiname = document.getElementById(i+"Name").innerHTML;
                }
                var getjsem = document.getElementById(j+"Sem").innerHTML;
                var getjname = document.getElementById(j+"Name").innerHTML;
               // var getilab= document.querySelector('input[name="r'+i+'"]:checked');
               // var getjlab= document.querySelector('input[name="r'+j+'"]:checked');
              if((getisem==getjsem)&&(getiname==getjname)){
                 document.getElementById("writertt24su").innerHTML="name should be unique within same sem";
                 console.log("gg");
                  return false;
              }
            }
            }
            
            console.log("all ok");
            var uuire = myUpdateSub("fst");
              if(uuire==false){
              return false;
               }
            for(var i=0;i<globel;i++){
              var uure = myUpdateSub(i);
              if(uure==false){
              return false;
               }

            }
         setTimeout(() => { 
            if(vari==1){
               document.getElementById("writertt24su").innerHTML="Successfully updated!!!";
              window.location="/teacher%20(1).html?time_schedule_name="+timet+"";
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
function myUpdateSub(count){

var timet = getUrlVars()["time_schedule_name"];
  timet= myhaserror(timet);
if(count=="fst"){
      var uname= document.getElementById("fstName").innerHTML;
      var uid= fstSubid;
      var usemno= document.getElementById("fstSem").innerHTML;
      if (document.getElementsByName("l2fst")[0].checked){
        var ulab=1;
    }else{
      var ulab=0;
    }
      var uhrs= document.getElementById("fstHrs").innerHTML;
      var uslot=document.getElementById("fstSlot").innerHTML ;
      var slotpe= myslotstr(uid);
      var parameters ='?time_schedule_name='+timet+'&sub_id='+uid+'&sub_name='+uname+'&fk_sem_no='+usemno+'&hrs_per_week='+uhrs+'&lab_or_not='+ulab+'&min_slot_length='+uslot+'&slot_pref='+slotpe ;
}else{
      
      var uname= document.getElementById(count+"Name").innerHTML;
      var uid= document.getElementById(count+"Id").innerHTML;
      var usemno= document.getElementById(count+"Sem").innerHTML;
      if (document.getElementsByName("r"+count)[0].checked){
        var ulab=1;
    }else{
      var ulab=0;
    }
      var uhrs= document.getElementById(count+"Hrs").innerHTML;
      var uslot=document.getElementById(count+"Slot").innerHTML ;
      var slotpe= myslotstr(uid);
      var parameters ='?time_schedule_name='+timet+'&sub_id='+uid+'&sub_name='+uname+'&fk_sem_no='+usemno+'&hrs_per_week='+uhrs+'&lab_or_not='+ulab+'&min_slot_length='+uslot+'&slot_pref='+slotpe ;
      }
       //updateSubject.json?time_schedule_name=TimeTable1&sub_id=1&sub_name="Java""&fk_sem_no=IV&hrs_per_week=5&lab_or_not=true&min_slot_length=1&slot_pref:"...Slot Pref..."
      
      if((usemno=="")||(usemno==null)||(uname=="")||(uhrs=="")||(uslot=="")){
        document.getElementById("writertt24su").innerHTML="please enter all fields";
        return false;
}
        console.log(parameters);
      
      $.ajax( "http://localhost:8086/api/updateSubject.json"+parameters )
      .done(function(data) {
      if(data.status == 200 ){
        //window.location=".html";
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
         maxslotlen=Math.floor(slotCount/2);
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
           dayday=getdayfh;
           
          }else{
            alert("enter and try again");
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })   

    }
    function aa(k,id){
/*  var text = "";
for (var i = 0; i < k; i++) {
    text += '<td style="text-align: center"><input type="checkbox"></td>';
}
document.getElementById("t".concat(id)).innerHTML =text;
*/

 document.getElementById("t"+id).innerHTML = "";
for (var i = 0; i < k; i++) {
    document.getElementById("t"+id).innerHTML  += '<td style="text-align: center"><input type="checkbox" id="'+fstSubid+'d'+id+'s'+i+'" checked></td>';
}
for (var i = 0; i < globel; i++) {
   document.getElementById("t"+id+"s"+i).innerHTML  = "";
   var sid =document.getElementById(i+"Id").innerHTML;
    for (var j = 0; j < k; j++) {
    document.getElementById("t"+id+"s"+i).innerHTML  += '<td style="text-align: center"><input type="checkbox" id="'+sid+'d'+id+'s'+j+'" checked></td>';
    }
    //document.getElementById("t"+id+"r"+i).innerHTML =text;
}
}
function mySlotcountFunction(myarray) {
  var t=0;
for (var i = 0; i < myarray.length; i++) {
  aa(Math.floor(myarray[t]),t);
  
  t++;
}
}
function myback(){
  var timet = getUrlVars()["time_schedule_name"];
        timet= myhaserror(timet);
        window.location="/sem.html?time_schedule_name="+timet+"";
}
//need to manage slot pref area of update get add
function myslotstr(uid){
  var myslotarr = [];
  console.log(dayday.length);
  console.log(dayday);
      for(var i=0;i<dayday.length;i++){
        myslotarr.push(new Array(Math.floor(dayday[i])));
      }
      for(var i=0;i<myslotarr.length;i++){
        console.log(dayday[i]);
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
function myslotget(sid,str){
      console.log(str);
      if((str=="..Time Matirx..")||(str== null)||(str== undefined)||(str== "undefined")){
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
            try{
            document.getElementById(sid+"d"+i+"s"+j).checked = false;
            // document.getElementById(uid+"d"+i+"tr"+j).checked;
          }catch(err){
            console.log("stoted teacher data is more then slot for days now");
          }
        }
      }
      }
    }