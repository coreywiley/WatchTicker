import React, { Component } from 'react';
import {ajaxWrapper} from 'functions';
import {Wrapper} from 'library';

import {FormWithChildren, TextInput, Header, If, Instance} from 'library';

class EditWatch extends Component {

    render() {

        var content = <div className="container">
            <Header text={'Create New Watch'} size={2} />
            <FormWithChildren redirectUrl={"/watch/{id}/"} objectName={"watch"} submitUrl={"/api/home/watch/"} defaults={'{state}'}>
                <TextInput name='brand' label='Brand' />
                <TextInput name='model' label='Model' />
                <TextInput name='reference_number' label='Reference Number' />
            </FormWithChildren>
        </div>;

        return (content);
    }
}
export default EditWatch;

/*
<If logic={[['exists', '{id}']]}>

</If>




<CardWithChildren name={resolveVariables({"text":"{props.name}"}, this)["text"]} required={""} >
<Icons src={"https://cdn4.iconfinder.com/data/icons/food-drink-14/24/Tomato-512.png"} num_icons={resolveVariables({"text":"{props.task_pomodoros}"}, this)["text"]} width={"40px"} required={""} >
</Icons>
<Button text={"Start Pomodoro"} type={"primary"} required={""} functions={[['ajaxWrapper', ''], ['ajaxWrapper', ''], ['setGlobalState', {'alarm': true}]]} >
</Button>
<Button text={"Complete"} type={"success"} required={""} functions={resolveVariables({"text":[['ajaxWrapper', {'type': 'POST', 'url': '/api/home/task/{props.task_id}/', 'data': {'completed': true}}], ['setGlobalState', {'refresh': true}]]}, this)["text"]} >
</Button>
</CardWithChildren>

*/
