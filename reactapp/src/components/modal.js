import React, { Component } from 'react';
import ajaxWrapper from "../base/ajax.js";


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
        return (
            <div className={modalClass} tabindex="-1" role="dialog" style={modalStyle} >
                <div onClick={this.props.onHide} style={backgroundStyle}></div>
                <div className="modal-dialog" role="document" style={{zIndex: '10'}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.props.onHide}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.props.content}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary">Save changes</button>
                        <button type="button" className="btn btn-secondary" onClick={this.props.onHide}>Close</button>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Modal;
