/**
 * ------Given input data this script generates a time_table------  (originally script2.js)
 * Assumptions:
 * slots_per_week for all sub sum up to or sum less than (no of full days * no. of slots) + (no of half days * no. of slots/2)
 * Days > 1
 * Slot_count > 1
 **/
var lib = require('./lib');

//---Some constants---
const T = true;
const F = false;

//---Some Classes---
class Day {
    constructor(day_name, full) {
        this.day_name = day_name;
        this.full = full;
        if (full == T)
            this.slots = module.exports.slot_count;
        else
            this.slots = module.exports.slot_count / 2;
    }
}
module.exports.Day = Day;

class Sub {
    constructor(sub_name, sem, slots_per_week, lab, slot_pref, min_slot_length) {
        this.sub_name = sub_name;
        this.sem = sem;
        this.slots_per_week = slots_per_week;
        this.lab = lab;
        this.slot_pref = slot_pref;
        this.min_slot_length = min_slot_length;
    }
}
module.exports.Sub = Sub;

class Teach {
    constructor(tr_name, max_continous_period, time_matirx) {
        this.tr_name = tr_name;
        this.max_continous_period = max_continous_period;
        this.time_matirx = time_matirx;
    }
}
module.exports.Teach = Teach;

//---Input Data---
module.exports.slot_count = 4;

module.exports.sem = [];
module.exports.sem.push("I");
module.exports.sem.push("II");

module.exports.days = [];
module.exports.days.push(new Day("M", T));
module.exports.days.push(new Day("T", F));

module.exports.sub = [];
module.exports.sub.push(new Sub("Math Prac", "I", 3, T, [[T, T, T, T], [T, T]], 2));
module.exports.sub.push(new Sub("Math", "I", 2, F, [[T, T, T, T], [T, T]], 1));
module.exports.sub.push(new Sub("Math II", "II", 1, F, [[T, T, T, T], [T, T]], 1));

module.exports.teach = [];
module.exports.teach.push(new Teach("SH", 5, [[T, T, T, T], [T, T]]));
module.exports.teach.push(new Teach("BR", 5, [[T, T, T, T], [T, T]]));

module.exports.subTeach = [];   //Contains (Subject,Tech) Tuples
module.exports.subTeach.push([0, 1]);
module.exports.subTeach.push([1, 0]);
module.exports.subTeach.push([2, 0]);

function subToTeacher(n) {
    let a = [];
    for (let i = 0; i < module.exports.subTeach.length; i++) {
        if (module.exports.subTeach[i][0] == n)
            a.push(module.exports.subTeach[i][1]);
    }
    return a;
}

function teacherToSub(n) {
    let a = [];
    for (let i = 0; i < module.exports.subTeach.length; i++) {
        if (module.exports.subTeach[i][1] == n)
            a.push(module.exports.subTeach[i][0]);
    }
    return a;
}

//---Generate the time table---
//Output DS Declaration
module.exports.res = [];
var S_remaining = [];
var arr = [];
var T_reserved = [];
var arr = [];
var force_sel = {subI: -1, times: 0, day: 0};
var q = []; //{s, x, y, arr, T_reserved, force_sel}
module.exports.generate = () => {
    //Some Preprocessing to input data
    for (let i = 0; i < module.exports.sub.length; i++) { //Convert from sem_name to sem_index in sem arr
        module.exports.sub[i].sem = module.exports.sem.indexOf(module.exports.sub[i].sem);
    }

    //Prepare Output DS
    module.exports.res = [];
    S_remaining = new Array(module.exports.sub.length);
    for (let i = 0; i < module.exports.sub.length; i++) {
        S_remaining[i] = module.exports.sub[i].slots_per_week;
    }
    arr = new Array(module.exports.sem.length);   //[Sem][Day][Slot]
    for (let i = 0; i < module.exports.sem.length; i++) {
        arr[i] = new Array(module.exports.days.length);
        for (let j = 0; j < module.exports.days.length; j++) {
            arr[i][j] = new Array(module.exports.days[j].slots);
            arr[i][j].fill(-1);
        }
    }
    T_reserved = new Array(module.exports.teach.length);   //[teach][day][period]
    for (let i = 0; i < T_reserved.length; i++) {
        T_reserved[i] = new Array(module.exports.days.length);
        for (let j = 0; j < T_reserved[i].length; j++) {
            T_reserved[i][j] = new Array(module.exports.days[j].slots);
            T_reserved[i][j].fill(false);
        }
    }
    force_sel = {subI: -1, times: 0, day: 0};
    q = [];

    //Add states or items and generate timetable
    addItems(0,0,0,lib.deepCopy(arr),lib.deepCopy(S_remaining),lib.deepCopy(T_reserved),lib.deepCopyObject(force_sel),0);
    while(q.length > 0 && module.exports.res.length <= 10) {
        //Select the most greedy item (state) and continue from there
        let selI = q.map(o => o.greed).lastIndexOf(Math.max.apply(Math, q.map(o => o.greed)));
        checkItem(q[selI]);
        q.splice(selI, 1);
    }
}
function addItems(s, x, y, arr, S_remaining, T_reserved, force_sel,greed) {
    if (s >= module.exports.sem.length) return;
    if (x >= module.exports.days.length) return;
    if (y >= module.exports.days[x].slots) return;

    for (let i = 0; i < module.exports.sub.length; i++) {
        q.push({s:s,x:x,y:y,subI: i, arr:arr,S_remaining: S_remaining, T_reserved:T_reserved,force_sel:force_sel,greed:greed});
        q[q.length-1].greed += calculate_greediness(q[q.length-1]); //Item with highest greediness gets to execute first
    }
    q.push({s:s,x:x,y:y,subI: -1, arr:arr,S_remaining: S_remaining, T_reserved:T_reserved,force_sel:force_sel,greed:greed});
    q[q.length-1].greed += calculate_greediness(q[q.length-1]);
}

function calculate_greediness(item) {
    let greed = -1;
    let base_price = 0
    for (let i = 0; i < item.x; i++) {
        base_price += module.exports.days[i].slots;
    }
    base_price += item.y;

    //Teacher Buzy
    let teacher_buzy = false;
    if(item.y-1 >= 0 && item.subI != -1) {
        for (let i = 0; i < subToTeacher(item.subI).length; i++) {
            if(item.T_reserved[subToTeacher(item.subI)[i]][item.x][item.y-1] == true) teacher_buzy=true;  //Teacher just taught a class
        }
    }
    if(teacher_buzy) greed -=1;

    //Null Subject
    if(item.subI == -1) greed-=2;
    for (let i = 0; i < item.y - 1; i++) {
        if (item.subI != -1 && item.arr[item.s][item.x][i] == -1) {
            greed-=3;
        }
    }

    //Lab
    if(item.subI != -1 && module.exports.sub[item.subI].lab == T) greed-=1;
    if((item.subI != -1 && module.exports.sub[item.subI].lab == F) || item.subI == -1) {
        for (let i = 0; i < item.y - 1; i++) {
            if (item.arr[item.s][item.x][i] != -1 && module.exports.sub[item.arr[item.s][item.x][i]].lab == T) {
                greed-=3;
            }
        }
    }
    //Sub taught earlier in same day
    for (let i = 0; i < item.y - 1; i++) {
        if (item.subI != -1 && item.arr[item.s][item.x][i] == item.subI) {
            greed -= 2;
            break;
        }
    }
    for (let i = item.y - 1; i >= 0; i--) {    //Add back some greed points for stacking of same subject
        if (item.subI != -1 && item.arr[item.s][item.x][i] != item.subI) break;
        greed += 2;
    }

    return greed;
}

function checkItem(item) {  //Check whether the given subject in given item can be added to routune and if yes, addItems to queue
    if (item.force_sel.sub_idx != -1 && item.force_sel.times > 0 && item.S_remaining[item.force_sel.sub_idx] > 0) {
        if (item.force_sel.day != item.x || item.force_sel.sub_idx != item.subI) return;
    }

    if(item.subI == -1) {
        allocateSub();
        return;
    }
    if (item.S_remaining[item.subI] == 0) return;
    if (module.exports.sub[item.subI].sem != item.s) return;
    if (module.exports.sub[item.subI].slot_pref[item.x][item.y] == F) return;

    let teach_not_available = false;
    let max_continuous_classes = false;
    for (let i = 0; i < subToTeacher(item.subI).length; i++) {
        if (module.exports.teach[subToTeacher(item.subI)[i]].time_matirx[item.x][item.y] == F || item.T_reserved[subToTeacher(item.subI)[i]][item.x][item.y] == true) {
            teach_not_available = true;
            break;
        }
        if (item.y >= module.exports.teach[subToTeacher(item.subI)[i]].max_continous_period && module.exports.teach[subToTeacher(item.subI)[i]].max_continous_period >= 1) {
            let continuous_classes = true;
            for (let j = item.y - module.exports.teach[subToTeacher(item.subI)[i]].max_continous_period; j < item.y; j++) {
                if (item.T_reserved[subToTeacher(item.subI)[i]][item.x][j] == F) {
                    continuous_classes = false;
                    break;
                }
            }
            if (continuous_classes)
                max_continuous_classes = true;
        }
    }
    if (teach_not_available || max_continuous_classes)
        return;


    //Alocate the subject and add items to queue
    allocateSub();
    return;
    function allocateSub() {
        arr2 = lib.deepCopy(item.arr);
        S_remaining2 = lib.deepCopy(item.S_remaining);
        T_reserved2 = lib.deepCopy(item.T_reserved);
        force_sel2 = lib.deepCopyObject(item.force_sel);
        arr2[item.s][item.x][item.y] = item.subI;
        S_remaining2[item.subI]--;
        for (let i = 0; i < subToTeacher(item.subI).length; i++)
            T_reserved2[subToTeacher(item.subI)[i]][item.x][item.y] = true;
        if(item.subI != -1 && force_sel2.sub_idx != -1 ) {
            if (force_sel2.times <= 0) {
                force_sel2.day = item.x;
                force_sel2.sub_idx = item.subI;
                force_sel2.times = module.exports.sub[item.subI].min_slot_length - 1;
            } else force_sel2.times--;
        }

        let sub_left_this_sem = false;  //Sub left to schedule this sem
        for (let i = 0; i < module.exports.sub.length; i++)
            if (S_remaining2[i] > 0 && module.exports.sub[i].sem == item.s) {sub_left_this_sem = T;break;}
        if(sub_left_this_sem == F) {
            if(item.s >= module.exports.sem.length - 1) {
                module.exports.res.push(lib.deepCopy(arr2));
                return;
            }
            else {
                addItems(item.s + 1, 0, 0, arr2, S_remaining2, T_reserved2, force_sel2,item.greed);return;
            }
        }
        else if (item.y + 1 < module.exports.days[item.x].slots) {
            addItems(item.s,item.x,item.y+1,arr2,S_remaining2,T_reserved2,force_sel2,item.greed);return;
        }
        else {
            addItems(item.s,item.x+1,0,arr2,S_remaining2,T_reserved2,force_sel2,item.greed);return;
        }
    }
}

module.exports.showRes = () => {
    for (let i = 0; i < module.exports.res.length; i++) {
        console.log("---Routine " + i + "---");
        for (let j = 0; j < module.exports.res[i].length; j++) {
            console.log("Sem " + module.exports.sem[j] + ":");
            for (let k = 0; k < module.exports.res[i][j].length; k++) {
                for (let l = 0; l < module.exports.res[i][j][k].length; l++) {
                    if (module.exports.res[i][j][k][l] == -1) {
                        process.stdout.write("null  ");
                        continue;
                    }
                    let teach_str = "";
                    for (let m = 0; m < subToTeacher(module.exports.res[i][j][k][l]).length; m++) {
                        if (m >= 1) teach_str += ",";
                        teach_str += module.exports.teach[subToTeacher(module.exports.res[i][j][k][l])[m]].tr_name;
                    }
                    process.stdout.write(module.exports.sub[module.exports.res[i][j][k][l]].sub_name + "(" + teach_str + ")  ");
                }
                console.log("");
            }
        }
    }
}
//generate();
//showRes();