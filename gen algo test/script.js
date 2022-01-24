/**
 * ------Given input data this script generates a time_table------
 * Assumptions:
 * slots_per_week for all sub sum up to or sum less than (no of full days * no. of slots) + (no of half days * no. of slots/2)
 * Days > 1
 * Max COntinous Period <= Math.floor(slot_count/2)
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
            this.slots = Math.floor(slot_count/2);
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
        this.min_slot_length = min_slot_length;
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

//---Input Data---
var slot_count = 6;

var sem = [];
sem.push("I");

var days = [];
days.push(new Day("M", T));
days.push(new Day("T", T));
days.push(new Day("W", T));
days.push(new Day("Th", T));
days.push(new Day("F", T));
days.push(new Day("S", F));

var sub = [];
sub.push(new Sub(1,"Math A", "I", 3, T, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 2));
sub.push(new Sub(2,"Math B", "I", 3, F, [[F, F, F, F, F, F], [F, F, F, F, F, F], [F, F, F, F, F, F], [F, F, F, F, F, F], [F, F, F, F, F, F], [T, T, T]], 1));
sub.push(new Sub(4,"Math B", "I", 3, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));
sub.push(new Sub(5,"Math B", "I", 3, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));
sub.push(new Sub(6,"Math B", "I", 3, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));
sub.push(new Sub(7,"Math B", "I", 47, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));
sub.push(new Sub(8,"Math B", "I", 47, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));
sub.push(new Sub(0,"Math B", "I", 3, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));
sub.push(new Sub(9,"Math B", "I", 3, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));
sub.push(new Sub(11,"Math B", "I", 3, F, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T]], 1));

var teach = [];
teach.push(new Teach(1,"SH", 3, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T]]));
teach.push(new Teach(2,"BR", 3, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T]]));
teach.push(new Teach(3,"BR", 3, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T]]));
teach.push(new Teach(4,"BR", 3, [[T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T], [T, T, T, T, T, T]]));

var subTeach = [];   //Contains (Subject,Tech) Tuples
subTeach.push([1, 1]);
subTeach.push([2, 2]);
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


//---Generate the time table---
//Prepare Output DS
var arr;
var res;
var T_reserved;
var force_sel;
function pre_process() {
    cachesubTech();

    for (let i = 0; i < sub.length; i++) { //Convert from sem_name to sem_index in sem arr
        sub[i].sem = sem.indexOf(sub[i].sem);
    }

    arr = new Array(sem.length);   //[Sem][Day][Slot]
    for (let i = 0; i < sem.length; i++) {
        arr[i] = new Array(days.length);
        for (let j = 0; j < days.length; j++) {
            arr[i][j] = new Array(days[j].slots);
            arr[i][j].fill(null);
        }
    }

    res = null;

    T_reserved = new Array(teach.length);   //[teach][day][period]
    for (let i = 0; i < T_reserved.length; i++) {
        T_reserved[i] = new Array(days.length);
        for (let j = 0; j < T_reserved[i].length; j++) {
            T_reserved[i][j] = new Array(days[j].slots);
            T_reserved[i][j].fill(false);
        }
    }

    force_sel = {sub_idx: -1, times: 0, day: 0};
    map = {}
}

var map;
function getHashCode(obj) {
    var hashCode = '';
    if (typeof obj !== 'object')
        return hashCode + obj;
    for (var prop in obj) // No hasOwnProperty needed
        hashCode += prop + getHashCode(obj[prop]); // Add key + value to the result string
    return hashCode;
}
getHashCodeCuston = (s,x,y,sub,T_reserved) => {
    var hashCode = '';
    hashCode += getHashCode(s);
    hashCode += getHashCode(x);
    hashCode += getHashCode(y);
    for(var i  = 0;i < sub.length;sub++) {
        if(s == sub[i].sem)
            hashCode += getHashCode(sub[i].slots_per_week);
    }
    hashCode += getHashCode(T_reserved);
    return hashCode;
};
function gen(s, x, y) {
    if (res !=  null)
        return;

    let sub_left_this_sem = false;  //Sub left to schedule this sem
    for (let i = 0; i < sub.length; i++) {
        if (sub[i].slots_per_week > 0 && sub[i].sem == s)
            sub_left_this_sem = T;
    }
    if (sub_left_this_sem == false && s >= sem.length - 1) {    //Successfully build the routine for all sem
        res = lib.deepCopy(arr);
        return;
    }
    if (sub_left_this_sem == false && s < sem.length - 1) {   //Successfully build the routine for current sem
        gen(s + 1, 0, 0);
        return;
    }

    if (x >= days.length)
        return;
    if (y >= days[x].slots)
        return;
    if (s >= sem.length)
        return;
    if(map[getHashCodeCuston(s,x,y,sub,T_reserved)] == true)
        return;
    map[getHashCodeCuston(s,x,y,sub,T_reserved)] = true;

    //Prepare a queue in such a way so as to match the subjects in it greedily
    let q = [];
    for (let i = 0; i < sub.length; i++) q.push(i);
    q = lib.shuffle(q);
    for (let i = 0; i < teach.length; i++) {
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
    for (let i = 0; i < sub.length; i++) {
        if (sub[i].lab == T && y < Math.floor(slot_count/2)) {
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
    if (arr[s][x][y - 1] != null && y != Math.floor(slot_count/2)) {
        q = lib.arrRemove(q, arr[s][x][y - 1]);
        q.unshift(arr[s][x][y - 1]);
    }
    //Run wihout allocating any subject to this slot first if previous was null
    if(force_sel.times <= 0 && y != 0 && y != Math.floor(slot_count/2) && arr[s][x][y-1] == null) {
        arr[s][x][y] = null;
        if (y + 1 != days[x].slots)
            gen(s, x, y + 1);
        else
            gen(s, x + 1, 0);
    }
    //Try allocating subjects in queue q in order
    for (const i of q) {
        if (sub[i].slots_per_week == 0)
            continue;
        if (sub[i].sem != s)
            continue;

        if (sub[i].slot_pref[x][y] == F)
            continue;

        //Algo currently considers that if one of the teacher of sub is buzy, sub cannot be taught
        let teach_not_available = false;
        let max_continuous_classes = false;
        for (let j = 0; j < subToTeacher(i).length; j++) {
            if (teach[subToTeacher(i)[j]].time_matirx[x][y] == F || T_reserved[subToTeacher(i)[j]][x][y] == true) {
                teach_not_available = true;
                break;
            }
            if (y >= teach[subToTeacher(i)[j]].max_continous_period && teach[subToTeacher(i)[j]].max_continous_period >= 1) {
                let continuous_classes = true;
                for (let k = y - teach[subToTeacher(i)[j]].max_continous_period; k < y; k++) {
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
            if (force_sel.day != x || y == Math.floor(slot_count/2))
                return;
            if (force_sel.sub_idx != i) continue;
        }
        //Allocate the sub to this slot
        for (let j = 0; j < subToTeacher(i).length; j++)
            T_reserved[subToTeacher(i)[j]][x][y] = true;
        sub[i].slots_per_week--;
        arr[s][x][y] = i;
        let old_force_sel = lib.deepCopyObject(force_sel);
        if (force_sel.times <= 0) {
            force_sel.day = x;
            force_sel.sub_idx = i;
            force_sel.times = Math.min(sub[i].min_slot_length - 1,sub[i].slots_per_week);
        } else force_sel.times--;

        if (y + 1 < days[x].slots)
            gen(s, x, y + 1);
        else
            gen(s, x + 1, 0);
        //Reverse back the changes
        for (let j = 0; j < subToTeacher(i).length; j++)
            T_reserved[subToTeacher(i)[j]][x][y] = false;
        arr[s][x][y] = null;
        sub[i].slots_per_week++;
        force_sel = old_force_sel;
    }

    //Run wihout allocating any subject to this slot later if previous was not null
    if (force_sel.times > 0 || (force_sel.times <= 0 && y != 0 && y != Math.floor(slot_count/2) && arr[s][x][y-1] == null)) return;
    arr[s][x][y] = null;
    if (y + 1 != days[x].slots)
        gen(s, x, y + 1);
    else
        gen(s, x + 1, 0);
}
//A Driver function
generate = () => {
    console.time('Time taken for generating:');
    pre_process();
    gen(0, 0, 0);
    console.timeEnd('Time taken for generating:');
};
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
generate();
showRes();
