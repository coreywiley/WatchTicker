import React, { Component } from 'react';
import Wrapper from './base/wrapper.js';


class Compiler extends Component {

   render() {
       var content = [];

       return (
           <Wrapper loaded={true} content={content} />
       );
   }
}

export default Compiler;
