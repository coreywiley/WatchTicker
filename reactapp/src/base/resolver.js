import getComponent from './../componentResolver.js';


function resolveVariables(dataMapping, data){
    var mappedData = fillDict(dataMapping, data);

    return mappedData;
}


function fillDict(dict, data) {
    var info = Object.assign({},dict);
    if (Array.isArray(dict)) {info = Object.assign([], dict);}

    for (var k in info) {
        if (typeof info[k] == 'object') {
            info[k] = fillDict(info[k], data);
        } else {
            var tempStr = info[k];
            info[k] = fillData(tempStr, data);
        }
    }

    return info
}


function fillData(tempStr, data) {
    //console.log("TempStr", tempStr, typeof tempStr);
    if (typeof tempStr != 'string') {
        return tempStr;
    }
    var start = tempStr.indexOf('{');
    var end = tempStr.indexOf('}');
    if (start > -1 && end > start) {
        var variable = tempStr.substring(start+1,end).split('.');
        var value = data;
        for (var i in variable){
            var miniVar = variable[i];
            value = value[miniVar];
        }

        var replaceString = '{' + tempStr.substring(start+1,end) + '}';
        if (typeof value == 'object') {
            tempStr = tempStr.replace(replaceString,JSON.stringify(value));
        } else {
            tempStr = tempStr.replace(replaceString, value);
        }
    }
    return tempStr;
}


function isJsonable(v) {
    try{
        return JSON.stringify(v) === JSON.stringify(JSON.parse(JSON.stringify(v)));
     } catch(e){
        /*console.error("not a dict",e);*/
        return false;
    }
}


export default resolveVariables;
