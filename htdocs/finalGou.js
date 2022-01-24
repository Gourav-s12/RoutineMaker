//final..........................................................3D
var semarr = [];
  var resultno=0;
  var resultarr= [];
var starttime=0;
var slotcount=0;
var recessduration=0;
var slotduration=0;
var recessslot=0;
var narrDay=[];
var ret= new Date();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    
    return vars;
  }
    function GenerateTable() {
  

      document.getElementById("writertt24p").innerHTML='<center><input type="button" value="Next Routine" class="btn btn-light" onclick="inTable()" /></center><br><center>(Press upper button to see next variation of your Routine)</center>';
        //Build an array containing Customer records.

        /*setTimeout(() => { 
           var ghn= makeArr(); }, 2000);*/

        //Create a HTML Table element.
        var testarr=makeArr();
        console.log(testarr);
        var table = document.createElement("TABLE");
        table.border = "1";
   // table.float="";
        //Get the count of columns.
        var columnCount = testarr[0].length;
        
        //Add the header row.
        var row = table.insertRow(-1);
        for (var i = 0; i < columnCount; i++) {
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = testarr[0][i];
            row.appendChild(headerCell);
        }
 
        //Add the data rows.
        for (var i = 1; i < testarr.length; i++) {
            row = table.insertRow(-1);
            for (var j = 0; j < columnCount; j++) {
                var cell = row.insertCell(-1);
                var x=testarr[i][j];
                if((x==undefined)||(x==null)||(x=="null")){
                  x="---";
                

                }
                cell.innerHTML =x ;

            }
            if(i==1){ columnCount--;}//deleting extra col of merge to avoid extra cell.....by -- cc
        }
 //http://localhost:8086/output.html?time_schedule_name=CCP%20Routine%202020
 //http://localhost:8086/api/generateTimeTable.json?time_schedule_name=CCP%20Routine%202020
        var dvTable = document.getElementById("dvTable");
        dvTable.innerHTML = "";
        dvTable.appendChild(table);
    
for (var i = 1; i <testarr.length; i++) {
	if((i%semarr.length)==1){
		table.rows[i].cells[0].rowSpan = semarr.length;//merging the rows evry 1st coloum
		table.rows[i+1].deleteCell(columnCount-1);//deleting extra col of merge to avoid extra cell.
	}
  /*if(i!=1){
    table.rows[i].deleteCell(columnCount-1);
  }*/
}
console.log(recessslot);
table.rows[1].cells[2+Math.floor(recessslot)].rowSpan = (semarr.length*narrDay.length);
    /* document.getElementById("writertt24p").innerHTML='<center><input type="button" value="Next Routine" class="btn btn-light" onclick="inTable()" /></center><br><center>(Press upper button to see next variation of your Routine)</center>';*/




     
    }
function mySems(){
      var timet = getUrlVars()["time_schedule_name"];
       var parameters ='?time_schedule_name='+timet ;
       myhaserror(timet);
      $.ajax( "http://localhost:8086/api/getSems.json"+parameters )
      .done(function(data) {
      if(data.status == 200 ){
        if(data.list.length >= 1){
              for(var i=0;i<data.list.length;i++){
                semarr[semarr.length] = data.list[i].sem_no ;
              }
              console.log(semarr);
          }else {
            document.getElementById("writertt24e").innerHTML="no sem error";
          }
          }else{
            alert(data.message);
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
      } 
      function inTable(){
        document.getElementById("dvTable").innerHTML="";
        document.getElementById("writertt24e").innerHTML=""; 
        document.getElementById("writertt24p").innerHTML=""; 
        resultarr.length=0;
        narrDay.length=0;
        semarr.length=0;
     myGetArr();


  }
  function myGetArr(){
            myTimeGet();
              mySems();
    document.getElementById("writertt24p").innerHTML="<center><img src='ajax-loader.gif'></center>";
     document.getElementById("writertt24e").innerHTML='<center><h1>Generating your Routine</h1></center>';
    $("#loadd").hide();
      var timet = getUrlVars()["time_schedule_name"];
      myhaserror(timet);
       var parameters ='?time_schedule_name='+timet+'&timeNo='+resultno ;
       console.log(parameters);
      $.ajax({ 
        url:"http://localhost:8086/api/generateTimeTable.json"+parameters ,
        timeout:120000
      }).done(function(data) {
      if(data.status == 200 ){
        $("#loadd").show();
        document.getElementById("writertt24e").innerHTML='';
        document.getElementById("writertt24p").innerHTML="";
      	console.log(data.result.length);
        if(data.result.length == 0){
              document.getElementById("writertt24e").innerHTML='there is no possible result ! Cannot create timetable using given input. Please try changing the input';
              return false;
              }
             
              console.log("there");
            resultarr= data.result;//after code become 3d remove [0] from here
            console.log(resultarr);
            resultno++;
            GenerateTable();

          }else {
             $("#loadd").show();
          	document.getElementById("writertt24e").innerHTML='there is no possible result ! Cannot create timetable using given input. Please try changing the input';
            document.getElementById("writertt24p").innerHTML="";
          }
          
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
      } 
      function myhaserror(str){
    var res = str.charAt(str.length-1);
    if(res=="#"){
      str = str.substring(0, str.length - 1);
      return str;    }
      return str;
 }
 function makeArr(){
var d=0;
var apm="am";
var headarr=[];
var period =1;
var h=0;
var n=0;
var timee="";
var str = new Array();
       /* str.push(["Day/Time","sem", "10.30am - 11.30am", "11.30am - 12.30pm","12.30pm - 1.30pm","[Recess]","1.50pm - 2.50 pm","2.50pm - 3.50pm","3.50pm - 4.50pm","4.50pm - 5.30pm"]);*/
        headarr[headarr.length]="Day/Time";
        headarr[headarr.length]="sem";
        for(var e=0;e<slotcount;e++){
          //calculating the time
        	if(e==Math.floor(recessslot)){
        		console.log("hello");
        		 n=ret.getHours();
          if(ret.getHours()>11){
            apm="pm";
            n-=12;
          }
          timee= n+"."+ret.getMinutes()+apm+" - ";
          ret.setTime(ret.getTime() + recessduration * 60000);
          n=ret.getHours();
          if(ret.getHours()>11){
            apm="pm";
            n-=12;
          }
          timee+= n+"."+ret.getMinutes()+apm;
          headarr[headarr.length]=timee;
        	}
        	//headarr[headarr.length]="period "+period;//"10.30am - 11.30am";//having time problem ...gg me
         // period++;
          n=ret.getHours();
          if(ret.getHours()>11){
            apm="pm";
            n-=12;
          }
          timee= n+"."+ret.getMinutes()+apm+" - ";
          ret.setTime(ret.getTime() + slotduration * 60000);
          n=ret.getHours();
          if(ret.getHours()>11){
            apm="pm";
            n-=12;
          }
          timee+= n+"."+ret.getMinutes()+apm;
          headarr[headarr.length]=timee;
        }
//console.log(headarr);

str.push(headarr);

for(var a=0;a<(narrDay.length);a++){
	d=0;
	for(var b=0;b<(resultarr.length);b++){
		var myarrmake=[];
		if(d==0){
			myarrmake[myarrmake.length]=narrDay[a];
		}else{
			//myarrmake[myarrmake.length]="";
		}
		d++;
		myarrmake[myarrmake.length]=semarr[b];
		console.log("manman");
		for(var c=0;c<(resultarr[b][a].length);c++){
			
			myarrmake[myarrmake.length]=resultarr[b][a][c];
			if(((c+1)==Math.floor(recessslot))&&h==0){
				myarrmake[myarrmake.length]="Break";//doing this allow me to add break in half day
			h++;
      }

}
		str.push(myarrmake);
}
}
console.log(str);
return  str;

 }
   function myTimeGet(){
      var timet = getUrlVars()["time_schedule_name"];
       var parameters ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getTimeTable.json"+parameters )
      //http://localhost:8086/api/getTimeTable.json?time_schedule_name=CCP%20Routine%202020
      .done(function(data) {
      if(data.status == 200 ){
        //obj.time_schedule_name, obj.ins_name, obj.start_time, obj.slot_count, obj.recess_duration,obj.slot_duration
        //document.getElementById("insname2").value = data.ins_name; 
        starttime = data.start_time; 
        recessduration = data.recess_duration; 
        slotcount = data.slot_count;
        slotduration = data.slot_duration_mins;
        recessslot =(slotcount/2);
  /*
        var r=(starttime.charAt(3)+starttime.charAt(4))
        console.log(r);
        console.log(starttime.substring(0, 2)+"go"+starttime.substring(3, 5))*/
         ret = new Date(0, 0, 0, starttime.substring(0, 2), starttime.substring(3, 5), 0);//(data.start_time);
        console.log(ret);
        

          }else{
            document.getElementById("writertt24").innerHTML="try again";
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })   
  var getdayfh = [1,2,3,4,5,6,7];
      var dayarr =[5,1,6,7,4,2,3];
      var arrDay=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var parameters2 ='?time_schedule_name='+timet ;
      $.ajax( "http://localhost:8086/api/getWorkingDays.json"+parameters2 )
      .done(function(data) {
      if(data.status == 200 ){
        
          for(var i=0;i<7;i++){
            if(data.message[i].full_half=="full"){
          getdayfh[dayarr[i]-1] = slotcount;
            }else if(data.message[i].full_half=="half"){
          getdayfh[dayarr[i]-1] = (slotcount/2);
            }else if(data.message[i].full_half=="none"){
          getdayfh[dayarr[i]-1] = 0;
            }
           }
           console.log(getdayfh);
           for (var i = 0; i < arrDay.length; i++) {
           	if (getdayfh[i]==0) {

           	} else {
           		narrDay[narrDay.length]=arrDay[i];
           	}
           }
           console.log(narrDay);
          }else{
            document.getElementById("writertt24").innerHTML="try again!";
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })  
    }
   // see line=133