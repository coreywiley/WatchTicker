import React, { Component } from 'react';
import ajaxWrapper from '../base/ajax.js';
import {Progress} from 'library';

class ProjectCard extends React.Component {
    constructor(props) {
      super(props);

      this.state = {'grades': 0, 'responses':1}
      this.responseCount = this.responseCount.bind(this);
      this.gradeCount = this.gradeCount.bind(this);
    }

    componentDidMount() {
      if (this.props.progress == true) {
      ajaxWrapper('GET','/api/home/answer/?count&question=' + this.props.question_id, {}, this.responseCount)
      ajaxWrapper('GET','/api/home/answer/?count&completed_analyses__gt=1&question=' + this.props.question_id, {}, this.gradeCount)
      }
    }

    responseCount(value) {
      this.setState({'responses':value['count']})
    }

    gradeCount(value) {
      this.setState({'grades':value['count']})
    }

    render() {
        var button = null;
        var button2 = null;
        if (this.props.link){
            button = <a href={this.props.link} className={"btn btn-" + this.props.button_type}>{this.props.button}</a>;
        } else {
            if (this.props.buttonComponent) {
                let ButtonComponent = this.props.buttonComponent;
                button = <ButtonComponent {...this.props.buttonComponentProps} />
            } else {
                if (this.props.globalStateName) {
                    button = <div className={"btn btn-" + this.props.button_type} onClick={() => this.props.onClick(this.props.globalStateName, this.props)}>{this.props.button}</div>;
                }
                else {
                    button = <div className={"btn btn-" + this.props.button_type} onClick={() => this.props.onClick(this.props)}>{this.props.button}</div>;
                }
            }
        }
        if (this.props.conflict_link) {
          button2 = <a href={this.props.conflict_link} className={"btn btn-danger"}>Check For Conflicts</a>;
        }

        if (this.props.progress != false) {
          var pct_complete = Math.floor((parseInt(this.state.grades) / parseInt(this.state.responses)) * 100)
          var progress = <Progress pct_complete={pct_complete} css={{'margin':'5px'}}/>
      } else {
        progress = <div></div>;
      }

        return (
            <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">

                    <h5 className="card-title">{this.props.name}</h5>
                    {progress}
                    <p className="card-text">{this.props.description}</p>
                    {button}
                    {button2}
                  </div>
                </div>
            </div>
        );
    }
}


export default ProjectCard;
