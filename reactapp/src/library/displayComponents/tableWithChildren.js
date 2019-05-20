import React, { Component } from 'react';
import {resolveVariables} from 'functions';
import {ajaxWrapper} from 'functions';
import {Json_Input} from 'library';

class TableWithChildren extends React.Component {
  constructor(props) {
      super(props);

      this.config = {
          form_components: [
              <Json_Input label={'headers'} name={'headers'} />,
          ],
          can_have_children: true,
      }
  }

    render() {
        var headers = [];

        for (var index in this.props.headers) {
          headers.push(<th>{this.props.headers[index]}</th>)
        }

        return (
            <table className='table'>
              <thead>
                <tr>
                  {headers}
                </tr>
              </thead>
              <tbody>
                {this.props.children}
              </tbody>
            </table>
        );
    }
}

export default TableWithChildren;
