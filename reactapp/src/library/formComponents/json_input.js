import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {If, Alert} from 'library';

class TextArea extends Component {
    constructor(props) {
      super(props);
      this.state = {'error': null}

      this.handle_change = this.handle_change.bind(this);
    }

    handle_change = (e) => {
       var name = e.target.getAttribute("name");
       var newState = {};

       try {
         newState[name] = JSON.parse(e.target.value);
         this.setState({error: null}, this.props.setFormState(newState))
       }
       catch {
         this.setState({error: 'Invalid Json'})
       }

    }


    render() {

        var layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var label = null;
        if (this.props.label && this.props.label != ''){
            label = <label>{this.props.label}</label>;
        }

        var json = JSON.stringify(this.props.value);

        return (
              <div className={"form-group " + layout}>
                {label}
                <textarea className="form-control" name={this.props.name}
                    rows={this.props.rows}
                    onChange={this.handle_change}
                    onBlur={this.props.onBlur}
                    value={json}
                    placeholder={this.props.placeholder}>
                </textarea>
                <If logic={this.state.error}>
                  <Alert text={this.state.error} type={'danger'} />
                </If>
              </div>
        )


    }
}

export default TextArea;
