import {FormWithChildren, LogInForm, SignUpForm, ListWithChildren, Div, If, Break, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph, CSSInput, Container, EmptyModal, PasswordInput, Json_Input, Function_Input, PasswordResetRequest, CardWithChildren, Icons} from 'library';
import PomodoroCard from 'projectLibrary/PomodoroCard.js';
import Alarm from 'projectLibrary/alarm.js';
import Nav from 'projectLibrary/nav.js';

let ComponentList = [
    FormWithChildren, LogInForm, SignUpForm, ListWithChildren, Div, If, Break, NumberInput, BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph, CSSInput, Container, EmptyModal, PasswordInput, Json_Input, Function_Input, PasswordResetRequest, CardWithChildren, Icons, PomodoroCard
];

var ComponentDict = {}
for (var i in ComponentList){
    var value = ComponentList[i];
    ComponentDict[value.name] = value;
}

export default ComponentDict;
