import React, {Component, Element} from 'react';

//using datamapping in list or form you can pass a dictionary like so dataMapping={'name':'Bob', 'id':'{id}', 'children':'{children.length}'}
// in this case, name will always be bob, id will resolve to the id of the data and children will resolve to the length of data.children

function resolveVariables(dataMapping, data){
    var mappedData = fillDict(dataMapping, data);

    return mappedData;
}


function fillDict(dict, data) {
    var info = Object.assign({},dict);
    if (Array.isArray(dict)) {info = Object.assign([], dict);}

    for (var k in info) {
        console.log("K", k, info, info[k], typeof info[k])
        //Broad Detection of React.Element type and probably other things.
        if (typeof info[k].type == "function") {
          console.log("React.Component")
        }
        else if (typeof info[k] == 'object') {
            info[k] = fillDict(info[k], data);
        }
        else {
            var tempStr = info[k];
            info[k] = fillData(tempStr, data);
        }
    }

    return info
}


function fillData(tempStr, data) {
    console.log("TempStr", tempStr, typeof tempStr);
    if (typeof tempStr != 'string') {
        return tempStr;
    }
    console.log("Data", data)

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
                if (miniVar == 'length') {
                  value = value.length;
                }
                else {
                  if (value) {
                    value = value[miniVar];
                  }
                }
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
