/**
 * ------Given input data this script generates a time_table------ (originally script.js)
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
            this.slots = Math.floor(module.exports.slot_count/2);
    }
}
module.exports.Day = Day;

class Sub {
    constructor(id, sub_name, sem, slots_per_week, lab, slot_pref, min_slot_length) {
        this.id = id;
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
    constructor(id,tr_name, max_continous_period, time_matirx) {
        this.id = id;
        this.tr_name = tr_name;
        this.max_continous_period = max_continous_period;
        this.time_matirx = time_matirx;
    }
}
module.exports.Teach = Teach;

//---Input Data---
module.exports.slot_count = 6;

module.exports.sem = [];
//module.exports.sem.push("I");

module.exports.days = [];
//module.exports.days.push(new Day("M", T));

module.exports.sub = [];
//sub.push(new Sub(1,"Math A", "I", 2, T, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]], 2));

module.exports.teach = [];
//module.exports.teach.push(new Teach(1,"SH", 5, [[T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T], [T, T, T, T]]));

module.exports.subTeach = [];   //Contains (Subject,Tech) Tuples
//module.exports.subTeach.push([1, 1]);
var subToTeacherArr;var teacherToSubArr;
function cachesubTech() {
    for (var i = 0; i < module.exports.subTeach.length; i++)
        module.exports.subTeach[i] = [module.exports.sub.map(o => o.id).indexOf(module.exports.subTeach[i][0]), module.exports.teach.map(o => o.id).indexOf(module.exports.subTeach[i][1])];
    subToTeacherArr = new Array(module.exports.sub.length);
    for (let i = 0; i < subToTeacherArr.length; i++)
        subToTeacherArr[i] = [];
    teacherToSubArr = new Array(module.exports.teach.length);
    for (let i = 0; i < teacherToSubArr.length; i++)
        teacherToSubArr[i] = [];

    for (let i = 0; i < module.exports.subTeach.length; i++) {
        subToTeacherArr[module.exports.subTeach[i][0]].push(module.exports.subTeach[i][1]);
        teacherToSubArr[module.exports.subTeach[i][1]].push(module.exports.subTeach[i][0]);
    }
}
function subToTeacher(n) { return subToTeacherArr[n]; }
function teacherToSub(n) { return teacherToSubArr[n]; }


//---Generate the time table---
//Prepare Output DS
var arr;
var res;
var T_reserved;
var force_sel;
function pre_process() {
    cachesubTech();

    for (let i = 0; i < module.exports.sub.length; i++) { //Convert from sem_name to sem_index in sem arr
        module.exports.sub[i].sem = module.exports.sem.indexOf(module.exports.sub[i].sem);
    }

    arr = new Array(module.exports.sem.length);   //[Sem][Day][Slot]
    for (let i = 0; i < module.exports.sem.length; i++) {
        arr[i] = new Array(module.exports.days.length);
        for (let j = 0; j < module.exports.days.length; j++) {
            arr[i][j] = new Array(module.exports.days[j].slots);
            arr[i][j].fill(null);
        }
    }

    res = null;

    T_reserved = new Array(module.exports.teach.length);   //[teach][day][period]
    for (let i = 0; i < T_reserved.length; i++) {
        T_reserved[i] = new Array(module.exports.days.length);
        for (let j = 0; j < T_reserved[i].length; j++) {
            T_reserved[i][j] = new Array(module.exports.days[j].slots);
            T_reserved[i][j].fill(false);
        }
    }

    force_sel = {sub_idx: -1, times: 0, day: 0};
}

function gen(s, x, y) {
    if (res !=  null) return;
    let sub_left_this_sem = false;  //Sub left to schedule this sem
    for (let i = 0; i < module.exports.sub.length; i++) {
        if (module.exports.sub[i].slots_per_week > 0 && module.exports.sub[i].sem == s)
            sub_left_this_sem = T;
    }
    if (sub_left_this_sem == false && s >= module.exports.sem.length - 1) {    //Successfully build the routine for all sem
        res = lib.deepCopy(arr);
        return;
    }
    if (sub_left_this_sem == false && s < module.exports.sem.length - 1) {   //Successfully build the routine for current sem
        gen(s + 1, 0, 0);
        return;
    }

    if (x >= module.exports.days.length) return;
    if (y >= module.exports.days[x].slots) return;
    if (s >= module.exports.sem.length) return;

    //Prepare a queue in such a way so as to match the subjects in it greedily
    let q = [];
    for (let i = 0; i < module.exports.sub.length; i++) q.push(i);
    q = lib.shuffle(q);
    for (let i = 0; i < module.exports.teach.length; i++) {
        if (y == 0) break;
        if (T_reserved[i][x][y - 1] == true) {
            //Put this teacher's subjects a bit behind
            for (let j = 0; j < teacherToSub(i).length; j++) {
                q = lib.arrRemove(q, teacherToSub(i)[j]);
                q.push(teacherToSub(i)[j]);
            }
        }
    }
    //Push Labs at back if not past break time
    for (let i = 0; i < module.exports.sub.length; i++) {
        if (module.exports.sub[i].lab == T && y < Math.floor(module.exports.slot_count/2)) {
            q = lib.arrRemove(q, i);
            q.push(i);
        }
    }
    //Put subjects previously taught behind.
    for (let i = 0; i < y - 1; i++) {
        if (arr[s][x][i] == null) continue;
        q = lib.arrRemove(q, arr[s][x][i]);
        q.push(arr[s][x][i]);
    }

    //Maximize continuous lectures of the same subject
    if (arr[s][x][y - 1] != null && y != Math.floor(module.exports.slot_count/2)) {
        q = lib.arrRemove(q, arr[s][x][y - 1]);
        q.unshift(arr[s][x][y - 1]);
    }
    //Run wihout allocating any subject to this slot first if previous was null
    if(force_sel.times <= 0 && y != 0 && arr[s][x][y-1] == null) {
        arr[s][x][y] = null;
        if (y + 1 != module.exports.days[x].slots)
            gen(s, x, y + 1);
        else
            gen(s, x + 1, 0);
    }
    //Try allocating subjects in queue q in order
    for (const i of q) {
        if (module.exports.sub[i].slots_per_week == 0)
            continue;
        if (module.exports.sub[i].sem != s)
            continue;

        if (module.exports.sub[i].slot_pref[x][y] == F)
            continue;

        //Algo currently considers that if one of the teacher of sub is buzy, sub cannot be taught
        let teach_not_available = false;
        let max_continuous_classes = false;
        for (let j = 0; j < subToTeacher(i).length; j++) {
            if (module.exports.teach[subToTeacher(i)[j]].time_matirx[x][y] == F || T_reserved[subToTeacher(i)[j]][x][y] == true) {
                teach_not_available = true;
                break;
            }
            if (y >= module.exports.teach[subToTeacher(i)[j]].max_continous_period && module.exports.teach[subToTeacher(i)[j]].max_continous_period >= 1) {
                let continuous_classes = true;
                for (let k = y - module.exports.teach[subToTeacher(i)[j]].max_continous_period; k < y; k++) {
                    if (T_reserved[subToTeacher(i)[j]][x][k] == F) {
                        continuous_classes = false;
                        break;
                    }
                }
                if (continuous_classes)
                    max_continuous_classes = true;
            }
        }
        if (teach_not_available || max_continuous_classes)
            continue;

        if (force_sel.times > 0) {
            if (force_sel.day != x) return;
            if (force_sel.sub_idx != i) continue;
        }
        //Allocate the sub to this slot
        for (let j = 0; j < subToTeacher(i).length; j++)
            T_reserved[subToTeacher(i)[j]][x][y] = true;
        module.exports.sub[i].slots_per_week--;
        arr[s][x][y] = i;
        let old_force_sel = lib.deepCopyObject(force_sel);
        if (force_sel.times <= 0) {
            force_sel.day = x;
            force_sel.sub_idx = i;
            force_sel.times = module.exports.sub[i].min_slot_length - 1;
        } else force_sel.times--;

        if (y + 1 < module.exports.days[x].slots)
            gen(s, x, y + 1);
        else
            gen(s, x + 1, 0);
        //Reverse back the changes
        for (let j = 0; j < subToTeacher(i).length; j++)
            T_reserved[subToTeacher(i)[j]][x][y] = false;
        arr[s][x][y] = null;
        module.exports.sub[i].slots_per_week++;
        force_sel = old_force_sel;
    }

    //Run wihout allocating any subject to this slot later if previous was not null
    if (force_sel.times > 0 || (y != 0 && arr[s][x][y-1] == null)) return;
    arr[s][x][y] = null;
    if (y + 1 != module.exports.days[x].slots)
        gen(s, x, y + 1);
    else
        gen(s, x + 1, 0);
}
//A Driver function
module.exports.generate = () => {
    console.time('Time taken for generating:');
    pre_process();
    gen(0, 0, 0);
    console.timeEnd('Time taken for generating:');
};
module.exports.showRes = () => {
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
                let teach_str = "";
                for (let m = 0; m < subToTeacher(res[i][j][k]).length; m++) {
                    if (m >= 1) teach_str += ",";
                    teach_str += teach[subToTeacher(res[i][j][k])[m]].tr_name;
                }
                process.stdout.write(sub[res[i][j][k]].sub_name + "(" + teach_str + ")  ");
            }
            console.log("");
        }
    }
};
module.exports.getResultArr = () => {
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
                for (let m = 0; m < subToTeacher(res[i][j][k]).length; m++) {
                    if (m >= 1) teach_str += ",";
                    teach_str += teach[subToTeacher(res[i][j][k])[m]].tr_name;
                }
                res2[i][j][k] = sub[res[i][j][k]].sub_name.trim() + "(" + teach_str + ")";
            }
        }
    }
    return res2;
};