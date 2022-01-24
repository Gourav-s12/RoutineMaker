$.ajaxSetup({
    dataType: 'json',
    xhrFields: {
       withCredentials: true
    },
    crossDomain: true
});
function changeForm(btn) {
	var panel = document.getElementById("rightPanel");
	var mode = btn.classList.contains('signin')
  
 var elems = document.querySelectorAll(".btn-connect-navigate");

  [].forEach.call(elems, function(el) {
      el.classList.remove("active");
  });
	if (mode) {
  	panel.classList.remove("hover");
    btn.classList.add("active");
  } else {
  	panel.classList.add("hover");
    btn.classList.add("active");
  }
}

function changelog() {
  $("#submitlog").hide();
  document.getElementById("loginvaild").innerHTML="<img src='ajax-loader.gif'>";
  if($("#logemail").val()=="" && $("#logpass").val()==""){
    document.getElementById("loginvaild").innerHTML="enter email-id or password !try again";
    $("#submitlog").show();
  }else{
  var parameters ='?email='+$("#logemail").val()+'&password='+$("#logpass").val() ;
$.ajax( "http://localhost:8086/api/login.json"+parameters )
  .done(function(data) {
  		console.log(data);
      if(data.status == 200 ){
          alert("welcome "+data.message);
          window.location="RG Home.html";
          }else{

          document.getElementById("loginvaild").innerHTML="invalid email-id or password !try again";
          }
          $("#submitlog").show();
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
    $("#submitlog").show();
  })
}
}
function changereg() {
  $("#submitreg").hide();
  document.getElementById("reginvaild").innerHTML="<img src='ajax-loader.gif'>";
  if($("#regemail").val()=="" || $("#regpass").val()=="" || $("#regname").val()==""){
  document.getElementById("reginvaild").innerHTML="enter email-id, password, name !try again";
    $("#submitreg").show();
  }else{
    if($("#regpass").val()!=$("#regpass2").val()){
      document.getElementById("reginvaild").innerHTML="enter password again";
      $("#submitreg").show();
    }else{
  var parameters ='?email='+$("#regemail").val()+'&password='+$("#regpass").val()+'&name='+$("#regname").val() ;
$.ajax( "http://localhost:8086/api/register.json"+parameters )
  .done(function(data) {
      if(data.status == 200 ){
          alert(data.message);
          }else{
            alert(data.message);
            document.getElementById("reginvaild").innerHTML="try again";
          }
          document.getElementById("reginvaild").innerHTML="";
          $("#submitreg").show();
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
    $("#submitreg").show();
  })
}
}
}
/*
function createtimetable() {
  document.getElementById("writertt").innerHTML="<img src='ajax-loader.gif'>";
  if($("#creatett").val()==""){
  document.getElementById("writertt").innerHTML="enter time table !try again";
  }else{
  var parameters ='?time_schedule_name='+$("#creatett").val() ;
$.ajax( "http://localhost:8086/api/createTimeTable.json"+parameters )
  .done(function(data) {
      if(data.status == 200 && data.message="Successfully Created"){
        mytimetable();
        alert(data.message);
          }else{
            document.getElementById("writertt").innerHTML="enter time table !try again";
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })   
}
}*/
/*
$.ajax( "http://localhost:8086/api/getTimeTables.json" )
  .done(function(data) {
      if(data.status == 200 && data.message="Successfully retrievd"){
        
          ShareInfoLength = data.list.length;
          alert("you have "+ShareInfoLength+" time_tables");
          var writter = "";
          if(ShareInfoLength==0){
            writter+='<div class="testcard"><div class="card"><div class="layer"></div><div class="content"><p>you have zero time_tables</p><div class="details"><h2><br><span>need to create one time_table first</span></h2></div></div></div>';
          }else{
          for(var i=0; i<ShareInfoLength; i++)
          {
            writter+='<div class="testcard"><div class="card"><div class="layer"></div><div class="content"><p>'+data.list[i].name+'</p><div class="details"><h2><br><span>'+data.list[i].institute+'</span></h2></div></div></div>';
          }
          //writter+='<div class="testcard"><div class="card"><div class="layer"></div><div class="content"><p>to create a new time table</p><div class="details"><h2><br><span><a href='+urltt+'>click here</a></span></h2></div></div></div>';
          document.getElementById("timetables").innerHTML=writter;
        }
          }else{
            alert("you have to login again");
          window.location="practice3.html";
          }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log( textStatus );
  })
*/
/*
///////do not delete the code in command line



/*
var btn2 = document.getElementById("submitreg");

btn2.addEventListener("click", function() {
  var ourRequest2 = new XMLHttpRequest();
  var url= "register.json";
  var parameters ='email='+$("#regemail").val()+'&password='+$("#regpass").val()+'&name='+$("#regname").val() ;

  ourRequest2.open("GET", url+"?"+parameters, true);
  ourRequest2.onload = function() {
    if (ourRequest2.status >= 200 && ourRequest2.status < 400) {
      var ourData = JSON.parse(ourRequest2.responseText);
      renderHTML2(ourData);
    } else {
      console.log("We connected to the server, but it returned an error.");
    }
    
  };
  ourRequest2.send();

  ourRequest2.onerror = function() {
    console.log("Connection error");
  };
  function renderHTML2(data) {
  if(data.status == 200 && data.message ==="Registration Suceess"){
    alert("welcome ");
    window.location="RG Home.html";//need session
  }else{
    document.getElementById("reginvalid").innerHTML="invalid input or server problem !try again or please wait";
  }


}*/