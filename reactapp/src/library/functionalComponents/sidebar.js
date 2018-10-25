import React, { Component } from 'react';
import {
    Image
} from 'library';
import Wrapper from 'base/wrapper.js';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            height: "0px"
        };
    }

    componentDidMount() {
        var height = String(window.outerHeight - this.props.headerHeight) + "px";
        var width = String(window.outerWidth * (this.props.widthPercent/100)) + "px";
        this.setState({
            height: height,
            width: width
        });
    }

    toggle() {
        if (this.state.open){
            this.setState({ open: false});
            this.props.toggleOpen(false);
        } else {
            this.setState({ open: true});
            this.props.toggleOpen(true);
        }
    }

    render() {
        var position = {
            position: "fixed",
            top: this.props.headerHeight + "px",
            right: "0px",
            width: this.state.width,
            background: "white",
            boxShadow: 'rgba(0, 0, 0, 0.2) -2px 2px 5px'
        }
        var toggleText = "Close";
        if (!this.state.open){
            position['right'] = "-" + this.state.width;
            toggleText = this.props.openerText;
        } else {
            position['zIndex'] = "100";
        }

        var openerStyle = {
            position: 'absolute',
            top: this.props.openerPosition,
            right: this.state.width,
            padding: '10px',
            background: 'white',
            borderTopLeftRadius: '10px',
            borderBottomLeftRadius: '10px',
            boxShadow: 'rgba(0, 0, 0, 0.3) -4px 2px 5px'
        }

        var opener =
        <div style={openerStyle}>
            <button className="btn btn-info" onClick={this.toggle.bind(this)}>{toggleText}</button>
        </div>

        var content = this.props.content;

        return (
            <div style={position} >
                {opener}
                <div className="container" style={{height: this.state.height, overflow: "scroll"}}>
                    <br/>
                    <Wrapper content={content} loaded={this.props.loaded} />
                    <br/>
                </div>
            </div>
        );
    }
}


export default Sidebar;
