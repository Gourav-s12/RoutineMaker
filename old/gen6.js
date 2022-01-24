const Genetic = require('genetic-js-no-ww');
const lib = require('./lib');

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
        this.min_slot_length = min_slot_length;
        this.pos = [];
    }
    fill_pos(indx_in_sub_arr) {
        var s = this.sem;
        for(var x = 0;x < days.length;x++) {
            for(var y = 0;y < days[x].slots;y++) {
                let posible = true;
                if(this.slot_pref[x][y] != true) posible=false;

                let teach_not_available = false;
                for (let i = 0; i < subToTeacher(indx_in_sub_arr).length; i++) {
                    if (teach[subToTeacher(indx_in_sub_arr)[i]].time_matirx[x][y] == false) {
                        teach_not_available = true;
                        break;
                    }
                }
                if(teach_not_available)
                    posible=false;

                if(posible)
                    this.pos.push({s:s,x:x,y:y});
            }
        }
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
class Schedule {
    constructor() {
        this.subAlocation = new Array(sub.length);
        for(var i = 0;i < sub.length;i++)
            this.subAlocation[i] = new Array(sub[i].slots_per_week);
    }

    copy(sch) {
        this.subAlocation = lib.deepCopy(sch.subAlocation);
    }

    random_initialize() {
        //Randomly allocate subjects
        var sub_inx = 0;
        var alocation_idx = 0;
        var map = {};
        sub[sub_inx].pos = lib.shuffle(sub[sub_inx].pos);
        var sel_idx = 0;
        while(true) {
            while(sub_inx < sub.length && alocation_idx >= this.subAlocation[sub_inx].length) {
                sub_inx++;
                alocation_idx = 0;
                sel_idx = 0;
                if(sub_inx < sub.length)
                    sub[sub_inx].pos = lib.shuffle(sub[sub_inx].pos);
            }
            if(sub_inx >= sub.length) break;
            if(sub[sub_inx].pos.length <= sel_idx) throw "Fewer subject slots than req during initialization."
            var sel = sub[sub_inx].pos[sel_idx];
            sel_idx++;
            if(map[sel.s+""+sel.x+sel.y] == true) continue;
            map[sel.s+""+sel.x+sel.y] = true;
            this.subAlocation[sub_inx][alocation_idx] = sel;
            alocation_idx++;
        }
    }
    fitness() { //We minimize this function using Genetic Algo
        var fit = 0;
        var arr = this.make_arr();
        var T_reserved = new Array(module.exports.teach.length); //[teach][day][period]
        for (let i = 0; i < T_reserved.length; i++) {
            T_reserved[i] = new Array(module.exports.days.length);
            for (let j = 0; j < T_reserved[i].length; j++) {
                T_reserved[i][j] = new Array(module.exports.days[j].slots);
                T_reserved[i][j].fill(false);
            }
        }
        if (arr == null) {
            throw "Cannot make array in fit function.";
        }
        for (var s = 0; s < arr.length; s++) {
            for (var x = 0; x < arr[s].length; x++) {
                for (var y = 0; y < arr[s][x].length; y++) {
                    if (arr[s][x][y] == null) {
                        var isAllnull = true; //An non-compulsory condition
                        for (var i = y + 1; i < arr[s][x].length; i++) {
                            if (arr[s][x][i] != null)
                                isAllnull = false;
                        }
                        if (isAllnull) fit++;
                        continue;
                    } else fit++;
                    if (sub[arr[s][x][y]].sem != s) throw "Wrong sem in fit function.";
                    //--Compulsory Conditions--
                    if (sub[arr[s][x][y]].slot_pref[x][y] != true) fit -= 1000;

                    let teach_not_available = false;
                    let max_continuous_classes = false;
                    for (let i = 0; i < subToTeacher(arr[s][x][y]).length; i++) {
                        if (teach[subToTeacher(arr[s][x][y])[i]].time_matirx[x][y] == false || T_reserved[subToTeacher(arr[s][x][y])[i]][x][y] == true) {
                            teach_not_available = true;
                            break;
                        }
                        if (y >= teach[subToTeacher(arr[s][x][y])[i]].max_continous_period && teach[subToTeacher(arr[s][x][y])[i]].max_continous_period >= 1) {
                            let continuous_classes = true;
                            for (let k = y - teach[subToTeacher(arr[s][x][y])[i]].max_continous_period; k < y; k++) {
                                if (T_reserved[subToTeacher(arr[s][x][y])[i]][x][k] == false) {
                                    continuous_classes = false;
                                    break;
                                }
                            }
                            if (continuous_classes) {
                                max_continuous_classes = true;
                                break;
                            }
                        }
                    }
                    if (teach_not_available)
                        fit -= 1000;
                    if (max_continuous_classes)
                        fit -= 1000;

                    if (sub[arr[s][x][y]].min_slot_length > 1 && (y + 1 >= arr[s][x].length || arr[s][x][y + 1] != arr[s][x][y])) {
                        var min_length_satisfied = true;
                        for (var i = y + 1 - sub[arr[s][x][y]].min_slot_length; i < y; i++) {
                            if (arr[s][x][i] != arr[s][x][y]) {
                                min_length_satisfied = false;
                                break;
                            }
                        }
                        if (!min_length_satisfied) fit -= 1000;
                    }

                    //--Non-compulsory conditions--
                    if (sub[arr[s][x][y]].lab && y >= slot_count_half) fit += 2; //Prefer Labs after break time
                    //Prevent repetation of same subject in same day
                    var lim = y - 1;
                    var isRep = false;
                    while (lim >= 0 && arr[s][x][lim] == arr[s][x][y]) lim--;
                    for (let i = 0; i <= lim; i++) {
                        if (arr[s][x][i] != arr[s][x][y]) {
                            isRep = true;
                            break;
                        }
                    }
                    if (!isRep) fit++;


                    //--Force Alocate the sub--
                    for (let i = 0; i < subToTeacher(arr[s][x][y]).length; i++) {
                        T_reserved[subToTeacher(arr[s][x][y])[i]][x][y] = true;
                    }
                }
            }
        }
        return fit;
    }
    make_arr() {
        var arr = new Array(sem.length);   //[Sem][Day][Slot]
        for (let i = 0; i < sem.length; i++) {
            arr[i] = new Array(days.length);
            for (let j = 0; j < days.length; j++) {
                arr[i][j] = new Array(days[j].slots);
                arr[i][j].fill(null);
            }
        }

        for(var i = 0;i < this.subAlocation.length;i++) {
            for(var j = 0;j < this.subAlocation[i].length;j++) {
                if(arr[this.subAlocation[i][j].s][this.subAlocation[i][j].x][this.subAlocation[i][j].y] != null) { //Conflict
                    console.log("Conflict between subject "+i+" and "+arr[this.subAlocation[i][j].s][this.subAlocation[i][j].x][this.subAlocation[i][j].y]+" at pos "+this.subAlocation[i][j].s+","+this.subAlocation[i][j].x+","+this.subAlocation[i][j].y);
                    return null;
                }
                arr[this.subAlocation[i][j].s][this.subAlocation[i][j].x][this.subAlocation[i][j].y] = i;
            }
        }
        return arr;
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


//Main Function
function generate() {
    pre_process();

    //To Do if possible to generate all with given slot count

    //Run the genetic algo
    var genetic = Genetic.create();

    genetic.seed = function() {
        var temp = new Schedule();
        temp.random_initialize();
        return temp;
    }

    genetic.fitness = function(entity) {
        Object.setPrototypeOf(entity, Schedule.prototype);
        return entity.fitness();
    };

    genetic.crossover = function(mother, father) {
        var son = new Schedule();
        son.copy(father);
        var sonArr = son.make_arr();
        var daughter = new Schedule(); 
        daughter.copy(mother);
        var daughterArr = daughter.make_arr();
        for(var i = 0;i < son.subAlocation.length;i++) {
            for(var j = 0;j < son.subAlocation[i].length;j++) {
                if(lib.rand(1,2) == 1) {
                    var targetS = lib.deepCopyObject(daughter.subAlocation[i][j]);                   
                    var targetD = lib.deepCopyObject(son.subAlocation[i][j]);
                    var exchangeS = sonArr[targetS.s][targetS.x][targetS.y];
                    var exchangeD = daughterArr[targetD.s][targetD.x][targetD.y];
                    //if(exchangeS != i) {
                        // console.log("Old Son:"+exchangeS)
                        // console.log(son.subAlocation[i][j]);
                        // console.log(targetS);
                        // //console.log(son.subAlocation[i][j]);
                        // console.log(sonArr);
                        if(exchangeS != null) {
                            for(var k = 0;k < son.subAlocation[exchangeS].length;k++) {
                                if(son.subAlocation[exchangeS][k].s == targetS.s && son.subAlocation[exchangeS][k].x == targetS.x && son.subAlocation[exchangeS][k].y == targetS.y) {
                                    //console.log(son.subAlocation[exchangeS][k]);
                                    son.subAlocation[exchangeS][k] = lib.deepCopyObject(son.subAlocation[i][j]);
                                    sonArr[son.subAlocation[i][j].s][son.subAlocation[i][j].x][son.subAlocation[i][j].y] = exchangeS;
                                    //console.log(son.subAlocation[exchangeS][k]);
                                    break;
                                }
                            }
                        } else sonArr[son.subAlocation[i][j].s][son.subAlocation[i][j].x][son.subAlocation[i][j].y] = null;
                        son.subAlocation[i][j] = targetS;
                        sonArr[targetS.s][targetS.x][targetS.y] = i;
                        //console.log(son.subAlocation[i][j]);
                        // console.log(sonArr);
                    //}
                    //console.log(son.subAlocation[i][j]);
                    // if(son.make_arr() == null) {
                    //     throw "FCK SON";
                    // }

                    //if(exchangeD != i) {
                        // console.log("Old DA:"+exchangeD);
                        // console.log(daughter.subAlocation[i][j]);
                        // console.log(targetD);
                        // console.log(daughterArr);
                        // console.log(daughter.subAlocation[i][j]);
                        if(exchangeD != null) {
                            for(var k = 0;k < daughter.subAlocation[exchangeD].length;k++) {
                                if(daughter.subAlocation[exchangeD][k].s == targetD.s && daughter.subAlocation[exchangeD][k].x == targetD.x && daughter.subAlocation[exchangeD][k].y == targetD.y) {
                                    // console.log(daughter.subAlocation[exchangeD][k]);
                                    //daughterArr[daughter.subAlocation[exchangeD][k].s][daughter.subAlocation[exchangeD][k].x][daughter.subAlocation[exchangeD][k].y] = null;
                                    daughter.subAlocation[exchangeD][k] = lib.deepCopyObject(daughter.subAlocation[i][j]);
                                    daughterArr[daughter.subAlocation[i][j].s][daughter.subAlocation[i][j].x][daughter.subAlocation[i][j].y] = exchangeD;
                                    // console.log(daughter.subAlocation[exchangeD][k]);
                                    break;
                                }
                            }
                        } else daughterArr[daughter.subAlocation[i][j].s][daughter.subAlocation[i][j].x][daughter.subAlocation[i][j].y] = null;
                        daughter.subAlocation[i][j] = targetD;
                        daughterArr[targetD.s][targetD.x][targetD.y] = i;
                        // console.log(daughterArr);
                    //}
                    //console.log(daughter.subAlocation[i][j]);
                    // if(daughter.make_arr() == null) {
                    //     throw "FCK DA";
                    // }                    
                    // console.log("-------");
                }
            }
        }
        return [son, daughter];
    };
    genetic.mutate = function(entity) {
        Object.setPrototypeOf(entity, Schedule.prototype);
        var child = new Schedule();
        child.copy(entity);
        for(var i = 0;i < child.subAlocation.length;i++) {
            for(var j = 0;j < child.subAlocation[i].length;j++) {
                if(lib.rand(1,slot_count_half) == 1) {
                    var arr = child.make_arr();
                    var f = lib.rand(0,days.length-1);
                    var target = {s:sub[i].sem, x: f, y:lib.rand(0,days[f].slots-1)};
                    var exchange = arr[target.s][target.x][target.y];
                    if(exchange != i) {
                        if(exchange != null) {
                            for(var k = 0;k < child.subAlocation[exchange].length;k++) {
                                if(child.subAlocation[exchange][k].s == target.s && child.subAlocation[exchange][k].x == target.x && child.subAlocation[exchange][k].y == target.y) {
                                    child.subAlocation[exchange][k] = lib.deepCopyObject(child.subAlocation[i][j]);
                                    break;
                                }
                            }
                        }
                        child.subAlocation[i][j] = target;
                    }
                }
            }
        }        
        return child;
    };
    genetic.generation = function(pop, generation, stats) {
    };

    genetic.notification = function(pop, generation, stats, isFinished) {
        if(isFinished) {
          console.log("Fitness: "+pop[0].fitness);
          res = pop[0].entity;
          Object.setPrototypeOf(res, Schedule.prototype);
          res = res.make_arr();
          showRes();
          console.timeEnd('Time taken for generating:');
        }
    }
    genetic.optimize = Genetic.Optimize.Maximize;

    genetic.select1 = Genetic.Select1.RandomLinearRank;
    genetic.select2 = Genetic.Select2.RandomLinearRank;

    console.time('Time taken for generating:');
    genetic.evolve({"size":250,"iterations": 700,"skip":2000,"workersCount":10, "mutation":0.3}, null);
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
    res = [];
    //Cache Sub Tech
    cachesubTech();

    //Convert from sem_name to sem_index in sem arr
    for (let i = 0; i < sub.length; i++) { 
        sub[i].sem = sem.indexOf(sub[i].sem);
        sub[i].fill_pos(i);
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
//Export Data
module.exports = {
    Day: Day,Sub: Sub,Teach: Teach,
    slot_count: slot_count,slot_count_half: slot_count_half,
    sem: sem, days: days, sub: sub, teach: teach, subTeach: subTeach,
    generate: generate,
};