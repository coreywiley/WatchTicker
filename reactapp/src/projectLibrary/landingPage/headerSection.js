import React, { Component } from 'react';
import Wrapper from 'base/wrapper.js';
import MetaTags from 'react-meta-tags';


class HeaderSection extends Component {
  constructor(props) {
    super(props);
      this.state = { width: 0, height: 0 };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

      return (
        <section style={{height: this.state.height}} className="header">
          <div class="overlay" style={{height:this.state.height}}></div>
          <div class="container">
            <div class="description ">
              <h1>
                {this.props.title}
                <p>{this.props.description}</p>
                <button class="btn btn-outline-secondary btn-lg">{this.props.buttonText}</button>
              </h1>
            </div>
          </div>
        </section>
      );
    }
}

export default HeaderSection;
