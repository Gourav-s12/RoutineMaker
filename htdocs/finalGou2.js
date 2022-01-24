//final.................................................4D
var semarr = [];
  var resultno=0;
  var resultarr= [];
var starttime=0;
var slotcount=0;
var recessduration=0;
var slotduration=0;
var recessslot=0;
var narrDay=[];

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
     var res = str.charAt(str.length-1);
    if(res=="#"){
      str = str.substring(0, str.length - 1);
      return str;    }
      return str;
    return vars;
  }
    function GenerateTable() {

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
}
    /* document.getElementById("writertt24p").innerHTML='<center><input type="button" value="Next Routine" class="btn btn-light" onclick="inTable()" /></center><br><center>(Press upper button to see next variation of your Routine)</center>';*/




     document.getElementById("writertt24p").innerHTML='<center><input type="button" value="Next Routine" class="btn btn-light" onclick="inTable()" /></center><br><center>(Press upper button to see next variation('+resultno+') of your Routine)</center>';
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
      resultno++;
      if(resultno==(resultarr.length)){
      	resultno=0;     
      	console.log(resultno);
      	 }
      	 GenerateTable();
  }
  function myGetArr(){

    document.getElementById("writertt24p").innerHTML="<center><img src='ajax-loader.gif'></center>";
     document.getElementById("writertt24e").innerHTML='<center><h1>Generating your Routine</h1></center>';
    $("#loadd").hide();
      var timet = getUrlVars()["time_schedule_name"];
      myhaserror(timet);
      console.log(timet);
       var parameters ='?time_schedule_name='+timet ;
      $.ajax({ 
        url:"http://localhost:8086/api/generateTimeTable.json"+parameters ,
        timeout:20000
      }).done(function(data) {
      if(data.status == 200 ){
        $("#loadd").show();
        document.getElementById("writertt24e").innerHTML='';
        document.getElementById("writertt24p").innerHTML="";
      	console.log(data.result.length);
        if(data.result.length == 0){
              document.getElementById("writertt24e").innerHTML='there is no possible result ! plaese change the input';
              return false;
              }
              myTimeGet();
              mySems();
              console.log("there");
            resultarr= data.result;
            console.log(resultarr);

          }else {
             $("#loadd").show();
          	document.getElementById("writertt24e").innerHTML='try again!';
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
var st=starttime;
var rd=recessduration;
var sd=slotduration;
var headarr=[];
var period =1;
var str = new Array();
       /* str.push(["Day/Time","sem", "10.30am - 11.30am", "11.30am - 12.30pm","12.30pm - 1.30pm","[Recess]","1.50pm - 2.50 pm","2.50pm - 3.50pm","3.50pm - 4.50pm","4.50pm - 5.30pm"]);*/
        headarr[headarr.length]="Day/Time";
        headarr[headarr.length]="sem";
        for(var e=0;e<slotcount;e++){
        	if(e==recessslot){
        		console.log("hello");
        		headarr[headarr.length]="[Recess]";
        	}
        	headarr[headarr.length]="period "+period;//"10.30am - 11.30am";//having time problem ...gg me
          period++;
        }
//console.log(headarr);

str.push(headarr);

for(var a=0;a<(narrDay.length);a++){
	d=0;
	for(var b=0;b<(resultarr[resultno].length);b++){
		var myarrmake=[];
		if(d==0){
			myarrmake[myarrmake.length]=narrDay[a];
		}else{
			//myarrmake[myarrmake.length]="";
		}
		d++;
		myarrmake[myarrmake.length]=semarr[b];
		console.log("manman");
		for(var c=0;c<(resultarr[resultno][b][a].length);c++){
			
			myarrmake[myarrmake.length]=resultarr[resultno][b][a][c];
			if((c+1)==recessslot){
				myarrmake[myarrmake.length]="Break";//doing this allow me to add break in half day
			}

}
		str.push(myarrmake);
}
}

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
        // document.getElementById("timeend").value = data.start_time+data.recess_duration+(data.slot_count*data.slot_duration); 
        console.log(data.start_time);
        var ret = new Date(data.start_time);
        ret.setTime(ret.getTime() + 1 * 60000);
        console.log(ret);
       // console.log(moment(data.start_time).add(30, 'm').toDate());
        /*console.log(data.time_schedule_name);
      if(timet != data.time_schedule_name ){
        document.getElementById("writertt24").innerHTML=" try again !";
      }*/

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