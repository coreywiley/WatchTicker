import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';

import {Container, Button, Image, Form, TextInput, Navbar, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import Nav from 'projectLibrary/nav.js';
import Sidebar from 'projectLibrary/loggedOutSidebar.js';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true
        };
    }

    setGlobalState() {

    }

    render() {
      var content =
      <div className="container" style={{'marginTop':'100px'}}>

              <h1>A New Way To Engage Your Audience</h1>
              <p>One of the key components to converting a lead into a customer is to get that user to simply say "YES".</p>
              <p>The struggle us marketers face today is they are probably saying yes behind their screen but you as a marketer cannot capture that type of response.  No matter how good your copy is or how good your landing page looks, you can't really tell if your audience is saying "YES".</p>
              <p>What if we told you there is a way to do this....</p>
              <p>If there was a way to track EVERY single users response.  Heck, you can even retarget those who said yes but got lost down your funnel.</p>
              <iframe src="https://slidemoji.com/slider/11/" width="100%" frameborder="0" height="300px" seamless="" scrolling="no">Browser not compatible.</iframe>
              <p>See, you are already getting the idea.  Just imagine what else you can implement this cool tool on.   Blog sites, email funnels, Facebook Canvas ads etc.</p>
              <p>Click, Engage, Convert</p>
              <p>It is simple as that!</p>
              <div className="row">
              <div class="col-md-6 col-xs-12">
                <div class="card p-30 pt-50 text-center">
                  <div>
                    <a class="avatar avatar-xxl status-success mb-3" href="../page/profile.html">
                      <img src="//c.fastcdn.co/u/a1ab1db8/3021999-0-testimonial3.jpg" alt="..." />
                    </a>
                  </div>
                  <h5><a>Amanda Saxon</a></h5>
                  <p><small class="fs-13">@amandhaa</small></p>
                  <p class="text-dark fs-12 mb-30">"WOW, this neat little tool has helped me re-engage my audience. I didn't realize how much people are actually saying yes but aren't converting."</p>

                </div>
              </div>
              <div class="col-md-6 col-xs-12">
                <div class="card p-30 pt-50 text-center">
                  <div>
                    <a class="avatar avatar-xxl status-success mb-3" href="../page/profile.html">
                      <img src="//c.fastcdn.co/u/a1ab1db8/3021991-0-testimonial2.jpg" alt="..." />
                    </a>
                  </div>
                  <h5><a>Carlos Menendez</a></h5>
                  <p><small class="fs-13">@carlinho20</small></p>
                  <p class="text-dark fs-12 mb-30">"This is a game changer, the ability to track unique clicks and keep them down the pipeline is so valuable."</p>

                </div>
              </div>
              </div>
            <footer className="footer">
              <p>Copyright © 2018 Nuvo Media LLC All rights reserved.</p>
            </footer>

          </div>;

        return (
          <div>
          <Nav />
          <Sidebar />
          <Wrapper loaded={true} content={content} />
          </div>
        );
    }
}



export default Home;
