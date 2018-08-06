import React, { Component } from 'react';
import resolveVariables from 'base/resolver.js';

class Modal extends Component {

    render() {
        var backgroundStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0px',
            left: '0px',
            background: 'rgba(0,0,0,0.2)',
            zIndex: '1'
        };

        var modalStyle = {};
        var modalClass = "modal fade";
        if (this.props.show){
            modalClass += " show";
            modalStyle.display = "block";
        }

        var content = [];

        let Component = this.props.component;
        var data = {};
        var dataMapping = {...this.props.dataMapping};
        console.log("Data",data, dataMapping);

        if (typeof(this.props.resolveData) == "undefined" || this.props.resolveData != false){
            dataMapping = resolveVariables(dataMapping, data);
        }

        //console.log("Key " + data.id, dataMapping);
        var componentInstance = <Component key={data.id} {...data} {...dataMapping}
            refreshData={this.refreshData} setGlobalState={this.props.setGlobalState} />;

        content.push(componentInstance);

        return (
            <div className={modalClass} tabindex="-1" role="dialog" style={modalStyle} >
                <div onClick={this.props.onHide} style={backgroundStyle}></div>
                <div className="modal-dialog" role="document" style={{zIndex: '10'}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                        <button type="button" className="close" aria-label="Close"
                            onClick={() => this.props.setGlobalState(this.props.globalStateName,false)}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                    <div className="modal-footer">
                        {this.props.buttons}
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Modal;
