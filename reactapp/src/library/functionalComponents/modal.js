import React, { Component } from 'react';
import {resolveVariables} from 'functions';

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
        if (this.props.show == true) {
            modalClass += " show";
            modalStyle.display = "block";
        }

        var content = this.props.content;

        return (
            <div className={modalClass} tabindex="-1" role="dialog" style={modalStyle} >
                <div onClick={this.props.onHide} style={backgroundStyle}></div>
                <div className="modal-dialog" role="document" style={{zIndex: '10'}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                        <button type="button" className="close" aria-label="Close"
                            onClick={this.props.onHide}>
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
