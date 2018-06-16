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

    var dataSplit = tempStr.split('{');
    //Add initial text to output
    var cleaned = dataSplit[0];
    //Search through string pieces to find closing tag
    for (var i=1; i<dataSplit.length; i++){
        var innerSplit = dataSplit[i].split('}');
        if (innerSplit.length > 1){
            var variable = innerSplit[0].split('.');
            var value = data;

            for (var j in variable){
                var miniVar = variable[j];
                value = value[miniVar];
            }

            if (typeof value == 'object') {
                cleaned += JSON.stringify(value) + innerSplit[1];
            } else {
                cleaned += value + innerSplit[1];
            }

        } else {
            cleaned += innerSplit[0];
        }
    }

    return cleaned;
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
