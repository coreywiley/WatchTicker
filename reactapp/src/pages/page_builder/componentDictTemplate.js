import {*library_imports*} from 'library';
*project_library_imports*
import Alarm from 'projectLibrary/alarm.js';
import Nav from 'projectLibrary/nav.js';

let ComponentList = [
    *all_imports*
];

var ComponentDict = {}
for (var i in ComponentList){
    var value = ComponentList[i];
    ComponentDict[value.name] = value;
}

export default ComponentDict;
