import {FormWithChildren, LogInForm, SignUpForm, ListWithChildren, Div, If, Break, NumberInput,
        BooleanInput, TextInput, Select, TextArea, FileInput, Button, Header, Paragraph, CSSInput,
        Container, EmptyModal, PasswordInput, Json_Input, Function_Input, PasswordResetRequest,
        CardWithChildren, Icons, Navbar,Link, Image, UnorderedList, ListItem, Span, Icon, Instance, DateTimePicker} from 'library';

let ComponentList = [
    Paragraph,
    Header,
    Container,
    Div,
    Break,
    Button,
    FormWithChildren,
    TextInput,
    CardWithChildren,
    Icons,
    Navbar,
    Link,
    Image,
    UnorderedList,
    ListItem,
    Span,
    Icon,
    LogInForm,
    PasswordInput,
    ListWithChildren,
    If,
    LogInForm,
    SignUpForm,
    PasswordResetRequest,
    Instance,
    DateTimePicker,
];




var ComponentDict = {}
for (var i in ComponentList){
    var value = ComponentList[i];
    ComponentDict[value.name] = value;
}

export default ComponentDict;
