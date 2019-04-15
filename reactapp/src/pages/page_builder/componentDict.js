import {FormWithChildren, LogInForm, SignUpForm, ListWithChildren, Div, If, Break, NumberInput,
        BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph, CSSInput,
        Container, EmptyModal, PasswordInput, ChildComponent, Json_Input, Function_Input, PasswordResetRequest,
        CardWithChildren, Icons} from 'library';
import Alarm from 'projectLibrary/alarm.js';
import PomodoroCard from 'projectLibrary/pomodoroCard.js';
import Nav from 'projectLibrary/nav.js';

let ComponentList = [
    Paragraph,
    Header,
    Container,
    Div,
    Break,
    Button,
    FormWithChildren,
    TextInput,
    PasswordInput,
    ListWithChildren,
    If,
    PomodoroCard,
    Alarm,
    LogInForm,
    SignUpForm,
    Nav,
    PasswordResetRequest,
    CardWithChildren,
    Icons,
];

var ComponentDict = {}
for (var i in ComponentList){
    var value = ComponentList[i];
    ComponentDict[value.name] = value;
}

export default ComponentDict;
