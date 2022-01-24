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
    if (typeof obj !== 'object')
        return hashCode + obj;
    for (var prop in obj) // No hasOwnProperty needed
        hashCode += prop + module.exports.getHashCode(obj[prop]); // Add key + value to the result string
    return hashCode;
}
module.exports.getHashCodeCuston = (s,x,y,sub,arr) => {
    var hashCode = '';
    hashCode += module.exports.getHashCode(s);
    hashCode += module.exports.getHashCode(x);
    hashCode += module.exports.getHashCode(y);
    /*for(var i  = 0;i < sub.length;sub++) {
        if(s == sub[i].sem)
        hashCode += module.exports.getHashCode(sub[i].slots_per_week);
    }*/
    //I need to hack this one out...
   // if(T_reserved[0] != null)
        hashCode += module.exports.getHashCode(arr[0]);
    return hashCode;
}
module.exports.rand = (min, max) =>  {
    return (Math.floor(Math.pow(10,14)*Math.random()*Math.random())%(max-min+1))+min;
}

