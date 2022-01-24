module.exports.deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
        if (Array.isArray(elem)) {
            copy.push(exports.deepCopy(elem))
        } else {
            if (elem == null) {
                copy.push(elem);
            } else if (typeof elem === 'object') {
                copy.push(exports.deepCopyObject(elem))
            } else {
                copy.push(elem);
            }
        }
    });
    return copy;
};
module.exports.deepCopyObject = (obj) => {
    let tempObj = {};
    for (let [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            tempObj[key] = exports.deepCopy(value);
        } else {
            if (typeof value === 'object') {
                tempObj[key] = exports.deepCopyObject(value);
            } else {
                tempObj[key] = value
            }
        }
    }
    return tempObj;
};
module.exports.arrRemove = (arr, value) => {
    return arr.filter(function (ele) {
        return ele != value;
    });
};
module.exports.shuffle = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
};
module.exports.getHashCode = (obj) => {
    var hashCode = '';
    if (typeof obj !== 'object') {
        if(typeof obj == "boolean") return hashCode + (obj ? "1" : "0");
        return hashCode + obj;
    }
    for (var prop in obj) // No hasOwnProperty needed
        hashCode += prop + module.exports.getHashCode(obj[prop]); // Add key + value to the result string
    return hashCode;
}
module.exports.getHashCodeCuston = (s,x,y,sub,arr,T_reserved) => {
    var hashCode = '';
    hashCode += s;
    hashCode += x;
    hashCode += y;
    for(var i  = 0;i < sub.length;i++) {
        if(s == sub[i].sem)
            hashCode += sub[i].slots_per_week;
    }
    // for(var i  = 0;i <= s;i++)
    //     for(var j  = 0;j < y;j++)
    //         hashCode += arr[i][x][j];
    // if(T_reserved.length >= 1){
    //         hashCode += module.exports.getHashCode(T_reserved[0][x][Math.max(y-1,0)]);
    //         hashCode += module.exports.getHashCode(T_reserved[0][x][y]);
    // }
    for(var i = 0;i < T_reserved.length;i++)
        for(var j = Math.max(y-2,0);j <= y;j++)
            hashCode += module.exports.getHashCode(T_reserved[i][x][j]);
    //hashCode += module.exports.getHashCode(T_reserved);
    return hashCode;
}
module.exports.rand = (min, max) =>  {
    return (Math.floor(Math.pow(10,14)*Math.random()*Math.random())%(max-min+1))+min;
}

module.exports.range = (min, max, step = 1) =>  {
    var list = [];
    for (var i = min; i <= max; i+=step) {
        list.push(i);
    }
    return list;
}