/**
 * ------Given input data this script generates a time_table------
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
            this.slots = slot_count;
        else
            this.slots = slot_count / 2;
    }
}

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

class Teach {
    constructor(tr_name, max_continous_period, time_matirx) {
        this.tr_name = tr_name;
        this.max_continous_period = max_continous_period;
        this.time_matirx = time_matirx;
    }
}

//---Input Data---
var slot_count = 6;

var sem = [];
sem.push("I");
sem.push("II");

var days = [];
days.push(new Day("M", T));
days.push(new Day("T", T));
days.push(new Day("T", T));
days.push(new Day("T", T));
days.push(new Day("T", T));
days.push(new Day("T", T));

var sub = [];
sub.push(new Sub("Math Prac", "I", 2, T, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]], 2));
sub.push(new Sub("Math", "I", 5, F, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]], 1));
sub.push(new Sub("Math II", "II", 5, F, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]], 1));
sub.push(new Sub("Math II", "II", 5, F, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]], 1));
sub.push(new Sub("Math II", "II", 5, F, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]], 1));
sub.push(new Sub("Math II", "II", 5, F, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]], 1));

var teach = [];
teach.push(new Teach("SH", 5, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]]));
teach.push(new Teach("BR", 5, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]]));

var subTech = [];   //Contains (Subject,Tech) Tuples
subTech.push([0, 1]);
subTech.push([1, 0]);
subTech.push([2, 0]);

function subToTeacher(n) {
    let a = [];
    for (let i = 0; i < subTech.length; i++) {
        if (subTech[i][0] == n)
            a.push(subTech[i][1]);
    }
    return a;
}

function teacherToSub(n) {
    let a = [];
    for (let i = 0; i < subTech.length; i++) {
        if (subTech[i][1] == n)
            a.push(subTech[i][0]);
    }
    return a;
}

//Some Preprocessing to input data
for (let i = 0; i < sub.length; i++) { //Convert from sem_name to sem_index in sem arr
    sub[i].sem = sem.indexOf(sub[i].sem);
}

//---Generate the time table---
//Prepare Output DS
var res = [];

var S_remaining = new Array(sub.length);
for (let i = 0; i < sub.length; i++) {
    S_remaining[i] = sub[i].slots_per_week;
}
var arr = new Array(sem.length);   //[Sem][Day][Slot]
for (let i = 0; i < sem.length; i++) {
    arr[i] = new Array(days.length);
    for (let j = 0; j < days.length; j++) {
        arr[i][j] = new Array(days[j].slots);
        arr[i][j].fill(-1);
    }
}
var T_reserved = new Array(teach.length);   //[teach][day][period]
for (let i = 0; i < T_reserved.length; i++) {
    T_reserved[i] = new Array(days.length);
    for (let j = 0; j < T_reserved[i].length; j++) {
        T_reserved[i][j] = new Array(days[j].slots);
        T_reserved[i][j].fill(false);
    }
}
var force_sel = {subI: -1, times: 0, day: 0};
var q = []; //s, x, y, arr, T_reserved, force_sel
function generate() {
    while(q.length > 0 && res.length <= 10) {
        let selI = q.map(o => o.greed).lastIndexOf(Math.max.apply(Math, q.map(o => o.greed)));
        checkItem(q[selI]);
        q.splice(selI, 1);
    }
}

function addItems(s, x, y, arr, S_remaining, T_reserved, force_sel,greed) {
    if (s >= sem.length) return;
    if (x >= days.length) return;
    if (y >= days[x].slots) return;

    for (let i = 0; i < sub.length; i++) {
        q.push({s:s,x:x,y:y,subI: i, arr:arr,S_remaining: S_remaining, T_reserved:T_reserved,force_sel:force_sel,greed:greed+2});
        q[q.length-1].greed += calculate_greediness(q[q.length-1]); //Item with highest greediness gets to execute first
    }
    q.push({s:s,x:x,y:y,subI: -1, arr:arr,S_remaining: S_remaining, T_reserved:T_reserved,force_sel:force_sel,greed:greed+2});
    q[q.length-1].greed += calculate_greediness(q[q.length-1]);
}

function calculate_greediness(item) {
    let greed = -1;
    let base_price = 0
    for (let i = 0; i < item.x; i++) {
        base_price += days[i].slots;
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
    if(item.subI != -1 && sub[item.subI].lab == T) greed-=1;
    if((item.subI != -1 && sub[item.subI].lab == F) || item.subI == -1) {
        for (let i = 0; i < item.y - 1; i++) {
            if (item.arr[item.s][item.x][i] != -1 && sub[item.arr[item.s][item.x][i]].lab == T) {
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
    if (sub[item.subI].sem != item.s) return;
    if (sub[item.subI].slot_pref[item.x][item.y] == F) return;

    let teach_not_available = false;
    let max_continuous_classes = false;
    for (let i = 0; i < subToTeacher(item.subI).length; i++) {
        if (teach[subToTeacher(item.subI)[i]].time_matirx[item.x][item.y] == F || item.T_reserved[subToTeacher(item.subI)[i]][item.x][item.y] == true) {
            teach_not_available = true;
            break;
        }
        if (item.y >= teach[subToTeacher(item.subI)[i]].max_continous_period && teach[subToTeacher(item.subI)[i]].max_continous_period >= 1) {
            let continuous_classes = true;
            for (let j = item.y - teach[subToTeacher(item.subI)[i]].max_continous_period; j < item.y; j++) {
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
                force_sel2.times = sub[item.subI].min_slot_length - 1;
            } else force_sel2.times--;
        }

        let sub_left_this_sem = false;  //Sub left to schedule this sem
        for (let i = 0; i < sub.length; i++)
            if (S_remaining2[i] > 0 && sub[i].sem == item.s) {sub_left_this_sem = T;break;}
        if(sub_left_this_sem == F) {
            if(item.s >= sem.length - 1) {
                res.push(lib.deepCopy(arr2));
                return;
            }
            else {
                addItems(item.s + 1, 0, 0, arr2, S_remaining2, T_reserved2, force_sel2,item.greed);return;
            }
        }
        else if (item.y + 1 < days[item.x].slots) {
            addItems(item.s,item.x,item.y+1,arr2,S_remaining2,T_reserved2,force_sel2,item.greed);return;
        }
        else {
            addItems(item.s,item.x+1,0,arr2,S_remaining2,T_reserved2,force_sel2,item.greed);return;
        }
    }
}

function showRes() {
    for (let i = 0; i < res.length; i++) {
        console.log("---Routine " + i + "---");
        for (let j = 0; j < res[i].length; j++) {
            console.log("Sem " + sem[j] + ":");
            for (let k = 0; k < res[i][j].length; k++) {
                for (let l = 0; l < res[i][j][k].length; l++) {
                    if (res[i][j][k][l] == -1) {
                        process.stdout.write("null  ");
                        continue;
                    }
                    let teach_str = "";
                    for (let m = 0; m < subToTeacher(res[i][j][k][l]).length; m++) {
                        if (m >= 1) teach_str += ",";
                        teach_str += teach[subToTeacher(res[i][j][k][l])[m]].tr_name;
                    }
                    process.stdout.write(sub[res[i][j][k][l]].sub_name + "(" + teach_str + ")  ");
                }
                console.log("");
            }
        }
    }
}
addItems(0,0,0,lib.deepCopy(arr),lib.deepCopy(S_remaining),lib.deepCopy(T_reserved),lib.deepCopyObject(force_sel),0);
console.time('gen');
generate();
console.timeEnd('gen');
showRes();