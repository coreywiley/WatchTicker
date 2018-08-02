import React, { Component } from 'react';
import resolveVariables from '../base/resolver.js';
import Progress from '../library/progress.js';

class ProjectCard extends React.Component {

    render() {
        var button = null;
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

        var pct_complete = Math.floor((parseInt(this.props.grades) / parseInt(this.props.responses)) * 100)

        return (
            <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">

                    <h5 className="card-title">{this.props.name}</h5>
                    <Progress pct_complete={pct_complete} css={{'margin':'5px'}}/>
                    <p className="card-text">{this.props.description}</p>
                    {button}
                  </div>
                </div>
            </div>
        );
    }
}


export default ProjectCard;


