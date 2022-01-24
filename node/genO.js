const Genetic = require('genetic-js-no-ww');
const lib = require('./lib');
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const fs = require('fs')
const execSync = require('child_process').execSync;

//Classes for DS of Problem
class Day {
    constructor(day_name, full) {
        this.day_name = day_name;
        this.full = full;
        if (full == true)
            this.slots = slot_count;
        else
            this.slots = slot_count_half;
    }
}
class Sub {
    constructor(id, sub_name, sem, slots_per_week, lab, slot_pref, min_slot_length) {
        this.id = id;
        this.sub_name = sub_name;
        this.sem = sem;
        this.slots_per_week = slots_per_week;
        this.lab = lab;
        this.slot_pref = slot_pref;
        this.min_slot_length = Math.max(min_slot_length,1);
    }
}
class Teach {
    constructor(id,tr_name, max_continous_period, time_matirx) {
        this.id = id;
        this.tr_name = tr_name;
        this.max_continous_period = max_continous_period;
        this.time_matirx = time_matirx;
    }
}

class Activity {
    constructor(id,sub_id,len) {
        this.id = id;
        this.sub_id = sub_id;
        this.len = len;
    }
}

//DS of Problem Defination
var slot_count = 6;
var slot_count_half = Math.floor(slot_count/2);
var sem = [];
var days = [];
var sub = [];
var teach = [];
var subTeach = [];
var activities = [];
var res = null;
//Main Function
function generate() {
    pre_process();
    writeXML();
    let stdout = execSync("cd ./node_modules/cpsolver & java -Xmx512m -cp cpsolver-1.3.189.jar org.cpsolver.ifs.example.tt.Test filempp.cfg ./test.xml ./output");
    stdout = stdout.toString();
    var loc = "./node_modules/cpsolver/output/"+stdout.substring(stdout.indexOf('/output\\')+8, stdout.length).trim()+"/solution_1.xml";
    //var loc = "./node_modules/cpsolver/output/01-May-20_145938/solution_1.xml";
    readXML(loc);
}
function writeXML() {
    var xml = '';
    xml+='<?xml version="1.0" encoding="UTF-8"?>';
    xml+='<Timetable>'

    xml+='<Generator version="2.0">';
    xml+='<DaysPerWeek>'+days.length+'</DaysPerWeek>';
    xml+='<SlotsPerDay>'+slot_count+'</SlotsPerDay>';
    xml+='<NrRooms>'+sem.length+'</NrRooms>';
    xml+='<NrInstructors>'+teach.length+'</NrInstructors>';
    xml+='<NrClasses>'+sub.length+'</NrClasses>';
    xml+='<FillFactor>1.0</FillFactor>';
    xml+='<ActivityLengthMax>'+slot_count+'</ActivityLengthMax>';
    xml+='<HardFreeResource>0.0</HardFreeResource>';
    xml+='<SoftFreeResource>0.0</SoftFreeResource>';
    xml+='<SoftUsedResource>0.4</SoftUsedResource>';
    xml+='<SoftUsedActivity>0.0</SoftUsedActivity>';
    xml+='<SoftFreeActivity>0.0</SoftFreeActivity>';
    xml+='<HardFreeActivity>0.0</HardFreeActivity>';
    xml+='<NrDependencies>0</NrDependencies>';
    xml+='</Generator>';

    xml+='<Problem version="2.0">';

    xml+='<General>';
    xml+='<DaysPerWeek>'+days.length+'</DaysPerWeek>';
    xml+='<SlotsPerDay>'+slot_count+'</SlotsPerDay>';
    xml+='<Resources>';
    xml+='<Classrooms>'+sem.length+'</Classrooms>';
    xml+='<Teachers>'+teach.length+'</Teachers>';
    xml+='<Classes>'+sub.length+'</Classes>';
    xml+='<Special>0</Special>';
    xml+='</Resources>';
    xml+='<Activities>'+activities.length+'</Activities>';
    xml+='<Dependences>0</Dependences>';
    xml+='</General>';

    xml+='<Resources>';
    xml+='<Classrooms>';
    for(var i = 0;i < sem.length;i++) {
        xml+='<Resource id="sem'+i+'">';
        xml+='<Name>sem'+i+'</Name>';
        xml+='<TimePreferences>';
        var cnt = 0;
        for(var x = 0;x < days.length;x++) {
            for(var y = 0;y < slot_count;y++) {
                if(y >= days[x].slots) {
                    xml+='<Hard>'+cnt+'</Hard>';
                }
                cnt++;
            }
        }
        xml+='</TimePreferences>';
        xml+='</Resource>';
    }
    xml+='</Classrooms>';

    xml+='<Teachers>';
    for(var i = 0;i < teach.length;i++) {
        xml+='<Resource id="teach'+i+'">';
        xml+='<Name>teach'+i+'</Name>';
        xml+='<TimePreferences>';
        var cnt = 0;
        for(var x = 0;x < days.length;x++) {
            for(var y = 0;y < slot_count;y++) {
                if(y < days[x].slots && teach[i].time_matirx[x][y] == false) {
                    xml+='<Hard>'+cnt+'</Hard>';
                }
                cnt++;
            }
        }        
        xml+='</TimePreferences>';
        xml+='</Resource>';
    }
    xml+='</Teachers>';

    xml+='<Classes>';
    for(var i = 0;i < sub.length;i++) {
        xml+='<Resource id="sub'+i+'">';
        xml+='<Name>sub'+i+'</Name>';
        xml+='<TimePreferences>';
        var cnt = 0;
        for(var x = 0;x < days.length;x++) {
            for(var y = 0;y < slot_count;y++) {
                if(y < sub[i].slot_pref[x].length && sub[i].slot_pref[x][y] == false) {
                    xml+='<Hard>'+cnt+'</Hard>';
                }
                if(sub[i].lab == true && y < slot_count-1 && days[x].slots != slot_count_half) {
                    xml+='<Soft>'+cnt+'</Soft>';
                }
                cnt++;
            }
        }        
        xml+='</TimePreferences>';
        xml+='</Resource>';
    }
    xml+='</Classes>';

    xml+='<Special/>';
    xml+='</Resources>';

    xml+='<Activities>';
    for(var i = 0;i < activities.length;i++) {
        xml+='<Activity id="a'+i+'">'; //sem_sub_len
        xml+='<Name>sub'+activities[i].sub_id+'</Name>';
        xml+='<Length>'+activities[i].len+'</Length>';
        xml+='<TimePreferences>';
        xml+='</TimePreferences>';
        xml+='<RequiredResources>';
        xml+='<Resource>sub'+activities[i].sub_id+'</Resource>';
        xml+='<Resource>sem'+sub[activities[i].sub_id].sem+'</Resource>';
        for(var j = 0;j < subToTeacherArr[activities[i].sub_id].length;j++)
            xml+='<Resource>teach'+subToTeacherArr[activities[i].sub_id][j]+'</Resource>';
        xml+='</RequiredResources>';
        xml+='</Activity>';
    }
    xml+='</Activities>';

    xml+='<Dependences></Dependences>';
    xml+='</Problem>';
    xml+='</Timetable>';

    fs.truncate("./node_modules/cpsolver/test.xml", 0, function() {
        fs.writeFile("./node_modules/cpsolver/test.xml", xml, function (err) {
            console.log("Written!");
        });
    });
}
function readXML(loc) {
    var arr = new Array(sem.length);   //[Sem][Day][Slot]
    for (let i = 0; i < sem.length; i++) {
        arr[i] = new Array(days.length);
        for (let j = 0; j < days.length; j++) {
            arr[i][j] = new Array(days[j].slots);
            arr[i][j].fill(null);
        }
    }

    var xml = fs.readFileSync(loc, 'utf8');
    var doc = new DOMParser().parseFromString(xml,'text/xml');
    var sol = doc.getElementsByTagName("Solution")[0];
    if(sol == null) return; //No solutions
    for(var i = 0;i < sol.getElementsByTagName("Activity").length;i++) {
        var activity = sol.getElementsByTagName("Activity")[i];
        var startPos = parseInt(activity.getElementsByTagName("StartTime")[0].textContent);
        var actId = parseInt(activity.getAttribute("id").replace(/[^0-9]/g, ''));

        //Assign the activity to arr
        if(activities[actId] == null) continue;
        for(var j = 0;j < activities[actId].len;j++) {
            var s = sub[activities[actId].sub_id].sem;
            var x = parseInt((startPos+j)/slot_count);
            var y = parseInt((startPos+j)%slot_count);
            if(arr[s][x][y] != null) throw "WTF";
            arr[s][x][y] = activities[actId].sub_id;
        }
    }
    res = arr;
}
//Some Pre-Processing Function
function pre_process() {
    //Import the data
    slot_count = module.exports.slot_count;
    slot_count_half = module.exports.slot_count_half;
    sem = module.exports.sem;
    days = module.exports.days;
    sub = module.exports.sub;
    teach = module.exports.teach;
    subTeach = module.exports.subTeach;
    res = null;
    //Cache Sub Tech
    cachesubTech();

    //Convert from sem_name to sem_index in sem arr
    for (let i = 0; i < sub.length; i++) { 
        sub[i].sem = sem.indexOf(sub[i].sem);
    }

    res = null;
    //Fill the activities
    activities = [];
    let id = 0;
    for (let i = 0; i < sub.length; i++) {
        while(sub[i].slots_per_week != 0) {
            if(sub[i].slots_per_week >= sub[i].min_slot_length) {
                activities.push(new Activity(id++,i,sub[i].min_slot_length));
                sub[i].slots_per_week -= sub[i].min_slot_length;
            }
            else {
                activities.push(new Activity(id++,i,sub[i].slots_per_week));
                sub[i].slots_per_week = 0;               
            }
        }
    }
}
var subToTeacherArr;var teacherToSubArr;
function cachesubTech() {
    for (var i = 0; i < subTeach.length; i++)
        subTeach[i] = [sub.map(o => o.id).indexOf(subTeach[i][0]), teach.map(o => o.id).indexOf(subTeach[i][1])];
        subToTeacherArr = new Array(sub.length);
    for (let i = 0; i < subToTeacherArr.length; i++)
        subToTeacherArr[i] = [];
    teacherToSubArr = new Array(teach.length);
    for (let i = 0; i < teacherToSubArr.length; i++)
        teacherToSubArr[i] = [];

    for (let i = 0; i < subTeach.length; i++) {
        subToTeacherArr[subTeach[i][0]].push(subTeach[i][1]);
        teacherToSubArr[subTeach[i][1]].push(subTeach[i][0]);
    }
}
function subToTeacher(n) { return subToTeacherArr[n]; }
function teacherToSub(n) { return teacherToSubArr[n]; }

//Post-processing functions
showRes = () => {
    if(res == null) {
        console.log("Cannot generate any time table.");
        return null;
    }
    for (let i = 0; i < res.length; i++) {
        console.log("Sem " + sem[i] + ":");
        for (let j = 0; j < res[i].length; j++) {
            for (let k = 0; k < res[i][j].length; k++) {
                if (res[i][j][k] == null) {
                    process.stdout.write("null  ");
                    continue;
                }
                process.stdout.write(sub[res[i][j][k]].sub_name+"  ");
            }
            console.log("");
        }
    }
};
getResultArr = () => {
    if(res == null) {
        return null;
    }
    let res2 = res;
    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].length; j++) {
            for (let k = 0; k < res[i][j].length; k++) {
                if (res[i][j][k] == null) {
                    res2[i][j][k] = "null";
                    continue;
                }
                let teach_str = "";
                for (let m = 0; m < subToTeacherArr[res[i][j][k]].length; m++) {
                    if (m >= 1) teach_str += ",";
                    teach_str += teach[subToTeacherArr[res[i][j][k]][m]].tr_name.trim();
                }
                res2[i][j][k] = sub[res[i][j][k]].sub_name.trim() + "(" + teach_str + ")";
            }
        }
    }
    return res2;
};
//Export Data
module.exports = {
    Day: Day,Sub: Sub,Teach: Teach,
    slot_count: slot_count,slot_count_half: slot_count_half,
    sem: sem, days: days, sub: sub, teach: teach, subTeach: subTeach,
    generate: generate,getResultArr: getResultArr,
};