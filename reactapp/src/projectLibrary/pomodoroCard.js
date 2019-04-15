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
            		<CardWithChildren name={resolveVariables(resolveVariables({"text":"{props.name}"}, this), window.cmState.getGlobalState(this))["text"]} required={resolveVariables(resolveVariables({"text":""}, this), window.cmState.getGlobalState(this))["text"]} >
			<Icons src={resolveVariables(resolveVariables({"text":"https://cdn4.iconfinder.com/data/icons/food-drink-14/24/Tomato-512.png"}, this), window.cmState.getGlobalState(this))["text"]} num_icons={resolveVariables(resolveVariables({"text":"{props.task_pomodoros}"}, this), window.cmState.getGlobalState(this))["text"]} width={resolveVariables(resolveVariables({"text":"40px"}, this), window.cmState.getGlobalState(this))["text"]} required={resolveVariables(resolveVariables({"text":""}, this), window.cmState.getGlobalState(this))["text"]} >
</Icons>
			<Button text={resolveVariables(resolveVariables({"text":"Start Pomodoro"}, this), window.cmState.getGlobalState(this))["text"]} type={resolveVariables(resolveVariables({"text":"primary"}, this), window.cmState.getGlobalState(this))["text"]} required={resolveVariables(resolveVariables({"text":""}, this), window.cmState.getGlobalState(this))["text"]} functions={resolveVariables(resolveVariables({"text":[['ajaxWrapper', ''], ['ajaxWrapper', ''], ['setGlobalState', {'alarm': true}]]}, this), window.cmState.getGlobalState(this))["text"]} >
</Button>
			<Button text={resolveVariables(resolveVariables({"text":"Complete"}, this), window.cmState.getGlobalState(this))["text"]} type={resolveVariables(resolveVariables({"text":"success"}, this), window.cmState.getGlobalState(this))["text"]} required={resolveVariables(resolveVariables({"text":""}, this), window.cmState.getGlobalState(this))["text"]} functions={resolveVariables(resolveVariables({"text":[['ajaxWrapper', {'type': 'POST', 'url': '/api/home/task/{props.task_id}/', 'data': {'completed': true}}], ['setGlobalState', {'refresh': true}]]}, this), window.cmState.getGlobalState(this))["text"]} >
</Button>
</CardWithChildren>
        )
    }

}


export default PomodoroCard;
