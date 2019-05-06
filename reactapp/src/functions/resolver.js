import React, {Component, Element} from 'react';

//using datamapping in list or form you can pass a dictionary like so dataMapping={'name':'Bob', 'id':'{id}', 'children':'{children.length}'}
// in this case, name will always be bob, id will resolve to the id of the data and children will resolve to the length of data.children

function resolveVariables(dataMapping, dataValues){
    var mappedData = fillDict(dataMapping, dataValues);

    return mappedData;
}


function fillDict(dataMapping, dataValues) {
    // A copy of the incoming mapping needs to be made in order to ensure
    // changes are made an saved safely
    var popupatedData = Object.assign({}, dataMapping);
    if (Array.isArray(dataMapping)) {
        popupatedData = Object.assign([], dataMapping);
    }

    for (var key in popupatedData) {
        // Broad Detection of React.Element type and probably other things.
        if (popupatedData[key]) {
            // Depending on the type of value stored in the key, either
            // Pass over functions
            // Repeat this function one level deeper
            // Map data into the value

            if (typeof popupatedData[key].type == "function") {
              console.log("React.Component");
            }
            else if (typeof popupatedData[key] == 'object') {
                popupatedData[key] = fillDict(popupatedData[key], dataValues);
            }
            else {
                var tempStr = popupatedData[key];
                popupatedData[key] = fillData(tempStr, dataValues);
            }

        }
    }

    return popupatedData
}


function fillData(tempStr, dataValues) {
    if (typeof tempStr != 'string') {
        return tempStr;
    }

    var dataSplit = tempStr.split('{');
    //Add initial text to output
    var resolvedValue = dataSplit[0];

    //Search through string pieces to find closing tag
    // This loop is essential to resolving more than one variable in
    // a single string
    for (var i=1; i<dataSplit.length; i++){
        var innerSplit = dataSplit[i].split('}');

        if (innerSplit.length > 1){
            // Split the variable into however many different levels
            // have been included
            var variableNames = innerSplit[0].split('.');
            var value = dataValues;

            for (var j in variableNames){
                var variableName = variableNames[j];

                if (variableName == 'length') {
                  value = value.length;
                }

                else if (value) {
                    value = value[variableName];
                }
            }

            // If the resolved value cannot be simply repesented as a string
            // convert it to JSON first
            if (typeof value == 'object') {
                resolvedValue += JSON.stringify(value) + innerSplit[1];
            }
            else {
                resolvedValue += value + innerSplit[1];
            }

        } else {
            resolvedValue += innerSplit[0];
        }
    }

    return resolvedValue;
}


// A simple brute force test to ensure an object is JSON compatible
function isJsonable(v) {
    try{
        return JSON.stringify(v) === JSON.stringify(JSON.parse(JSON.stringify(v)));
     } catch(e){
        /*console.error("not a dict",e);*/
        return false;
    }
}


export default resolveVariables;
