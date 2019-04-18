import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';
import {TextInput, CardWithChildren, Icons, Button} from 'library';
import settings from 'base/settings.js';

class PomodoroCard extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput name={'name'} label={'name'} />,
<TextInput name={'task_pomodoros'} label={'task_pomodoros'} />,
<TextInput name={'task_id'} label={'task_id'} />
            ],
            can_have_children: false
        }
    }

    render () {

        return (
            		<CardWithChildren name={resolveVariables({"text":"{props.name}"}, this)["text"]} required={""} >
			<Icons src={"https://cdn4.iconfinder.com/data/icons/food-drink-14/24/Tomato-512.png"} num_icons={resolveVariables({"text":"{props.task_pomodoros}"}, this)["text"]} width={"40px"} required={""} >
</Icons>
			<Button text={"Start Pomodoro"} type={"primary"} required={""} functions={[['ajaxWrapper', ''], ['ajaxWrapper', ''], ['setGlobalState', {'alarm': true}]]} >
</Button>
			<Button text={"Complete"} type={"success"} required={""} functions={resolveVariables({"text":[['ajaxWrapper', {'type': 'POST', 'url': '/api/home/task/{props.task_id}/', 'data': {'completed': true}}], ['setGlobalState', {'refresh': true}]]}, this)["text"]} >
</Button>
</CardWithChildren>
        )
    }

}


export default PomodoroCard;
