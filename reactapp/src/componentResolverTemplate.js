import {{IMPORTS}} from './library';

function getComponent(type, value){
    var pointer = undefined;

    if (type == "name"){
        pointer = getComponentByName(value);
    } else if (type == "id"){
        pointer = getComponentById(value);
    }

    return pointer;
}

function getComponentByName(name){
{{NAMERESOLVERS}}
}

function getComponentById(id){
{{IDRESOLVERS}}
}


export default getComponent;
