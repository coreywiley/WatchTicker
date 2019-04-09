import React, { Component } from 'react';
import {resolveVariables} from 'functions';

class Stars extends React.Component {
    render() {
        var size = 'fa-1x';
        if (this.props.size) {
            size = 'fa-' + this.props.size + 'x';
        }

       var icon = 'fa-star';
       var filled = 0;
       if (this.props.filled) {
         filled = this.props.filled;
       }

       var stars = [];
       for (var i = 0; i < 5; i++) {
         if (i < filled) {
           stars.push(<i style={{'color':'#ffc120'}} className={"fas " + size + " " + icon}></i>)
         }
         else {
           stars.push(<i style={{'color':'#ccc'}} className={"fas " + size + " " + icon}></i>)
         }
       }


        return (
            <div style={{'display':'inline-block'}}>
              {stars}
            </div>
        );
    }
}

export default Stars;
