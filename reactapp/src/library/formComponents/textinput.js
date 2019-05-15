import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {NumberInput, Select, CSSInput} from 'library';

var BOOLEANS = [
  {'text':'True', value:true},
  {'text':'False', value:false},
];

class Suggestion extends Component {
    constructor(props) {
        super(props);

        this.state = {'hover':false}

        this.click_handler = this.click_handler.bind(this);
        this.mouse_enter = this.mouse_enter.bind(this);
    }

    mouse_enter() {
        this.setState({hover: !this.state.hover})
    }

    click_handler() {
        var new_state = {}
        new_state[this.props.name] = this.props.text;
        this.props.setFormState(new_state)
    }

    render() {
        var backgroundColor = 'white';
        if (this.props.active || this.state.hover) {
            backgroundColor = 'lightblue';
        }
        return (<li className='suggestion' onMouseEnter={this.mouse_enter} onMouseLeave={this.mouse_enter} onClick={this.click_handler} style={{borderBottom:'1px #ccc solid', backgroundColor: backgroundColor}}>{this.props.text}</li>)
    }
}

class TextInput extends Component {
    constructor(props) {
        super(props);
        this.config = {
            form_components: [
                <TextInput label={'name'} name={'name'} default={'Default Text'} />,
                <TextInput label={'default'} name={'default'} />,
                <TextInput label={'placeholder'} name={'placeholder'} />,
                <TextInput label={'label'} name={'label'} />,
                <Select label={'required'} name={'required'} options={BOOLEANS} />,
                <TextInput label={'class'} name={'className'} />,
                <CSSInput label={'css'} name={'style'} default={{}} />,
            ],
        }

        if (props) {
            this.state = {focused:false, key_position: -1, suggestion_filters: []}
        }
        else {
            this.state = {focused:false, key_position: -1, suggestion_filters: []}
        }


        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.setFormState = this.setFormState.bind(this);
    }

    onBlur() {
        //setTimeout(() => this.setState({ focused: false }), 200);
    }

    onFocus() {
        this.setState({ focused: true })
    }

    setFormState(new_state) {
        this.setState({key_position:-1}, () => this.props.setFormState(new_state))
    }

    handleKeyDown(e) {

        if (this.props.suggestions) {
            var key_position = this.state.key_position;

            // arrow up/down button should select next/previous list element
            if (e.keyCode === 38 && key_position > -1) {
              this.setState({key_position: key_position - 1});
            }
            else if (e.keyCode === 40) {
              this.setState({key_position: key_position + 1});
            }
            else if (e.keyCode === 13 && key_position > -1) {
              var new_state = {}
              if (this.state.suggestion_filters) {
                  new_state[this.props.name] = this.state.suggestion_filters[key_position]
              }
              else {
                  new_state[this.props.name] = this.state.suggestion_filters[key_position]
              }
              this.props.setFormState(new_state)
            }
          }

      }

      handleChange = (e) => {
          var suggestion_position = -1;
          option_list = null;
          if (this.state.focused && this.props.suggestions) {
              var suggestions = this.props.suggestions;
              var value = e.target.value;
              var option_list = [];
              for (var index in suggestions) {
                  var suggestion = suggestions[index];
                  if (this.props.value == '' || suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                      option_list.push(suggestion)
                  }
              }
          }

          this.setState({key_position:-1, suggestion_filters:option_list})
          this.props.handleChange(e);
      }

    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var style = this.props.style || {};

        var input = <input type="text" className="form-control" name={this.props.name}
            onChange={this.handleChange} value={this.props.value} placeholder={this.props.placeholder}
            onKeyPress={this.props.handleKeyPress} style={style} onKeyDown={this.handleKeyDown}
            onBlur={this.onBlur} onFocus={this.onFocus} />;
        if (this.props.autoFocus) {
          input = <input autoFocus type="text" className="form-control" name={this.props.name}
              onChange={this.handleChange} value={this.props.value} placeholder={this.props.placeholder}
              onKeyPress={this.props.handleKeyPress} style={style} onKeyDown={this.handleKeyDown}
              onBlur={this.onBlur} onFocus={this.onFocus} />
        }

        var label = null;
        if (this.props.label && this.props.label != '') {
            label = <label>{this.props.label}</label>;
        }

        var options = null;

        var suggestion_position = -1;
        if (this.state.focused && this.props.suggestions) {
            var suggestions = this.state.suggestion_filters;

            var option_list = [];
            for (var index in suggestions) {
                var suggestion = suggestions[index];
                var active = (index == this.state.key_position);
                option_list.push(<Suggestion text={suggestion} setFormState={this.setFormState} name={this.props.name} active={active}/>)
            }

            if (option_list.length > 0) {
                var options = <div style={{position:'relative', width:'100%'}}>
                    <ul style={{listStyle:'none', position:'absolute', background:'white', padding:'5px', border:'#ccc solid 1px', width:'100%', zIndex:40}}>
                        {option_list}
                    </ul>
                </div>
            }
        }

        return (
              <div className={"form-group " + this.props.layout}>
                {label}
                {input}
                {options}
              </div>
        )


    }
}

export default TextInput;
