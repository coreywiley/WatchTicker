import React, { Component } from 'react';

import Wrapper from 'base/wrapper.js';

import {Container, Button, Image, Form, TextInput, List, Link, Accordion, Paragraph, RadioButton, TextArea, Header} from 'library';
import Navbar from 'projectLibrary/nav.js';

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
      var content = <div><header className="header">
      <nav className="navbar navbar-expand-lg fixed-top"><a href="index.html" className="navbar-brand">Landy</a>
        <button type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler navbar-toggler-right"><span></span><span></span><span></span></button>
        <div id="navbarSupportedContent" className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto align-items-start align-items-lg-center">
            <li className="nav-item"><a href="#about-us" className="nav-link link-scroll">About Us</a></li>
            <li className="nav-item"><a href="#features" className="nav-link link-scroll">Features</a></li>
            <li className="nav-item"><a href="#testimonials" className="nav-link link-scroll">Testimonials</a></li>
            <li className="nav-item"><a href="text.html" className="nav-link">Text Page</a></li>
          </ul>
          <div className="navbar-text">
<a href="#" data-toggle="modal" data-target="#exampleModal" className="btn btn-primary navbar-btn btn-shadow btn-gradient">Sign Up</a>
          </div>
        </div>
      </nav>
    </header>

    <div id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" className="modal fade">
      <div role="document" className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="exampleModalLabel" className="modal-title">Sign Up Modal</h5>
            <button type="button" data-dismiss="modal" aria-label="Close" className="close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <form id="signupform" action="#">
              <div className="form-group">
                <label for="fullname">Full Name</label>
                <input type="text" name="fullname" placeholder="Full Name" id="fullname" />
              </div>
              <div className="form-group">
                <label for="username">User Name</label>
                <input type="text" name="username" placeholder="User Name" id="username" />
              </div>
              <div className="form-group">
                <label for="email">Email Address</label>
                <input type="text" name="email" placeholder="Email Address" id="email" />
              </div>
              <div className="form-group">
                <button type="submit" className="submit btn btn-primary btn-shadow btn-gradient">Signup</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <section id="hero" className="hero hero-home bg-gray">
      <div className="container">
        <div className="row d-flex">
          <div className="col-lg-6 text order-2 order-lg-1">
            <h1>Landy &mdash; Bootstrap&nbsp;4 landing page</h1>
            <p className="hero-text">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</p>
            <div className="CTA"><a href="#features" className="btn btn-primary btn-shadow btn-gradient link-scroll">Discover More</a><a href="#" className="btn btn-outline-primary">Sign Up Now</a></div>
          </div>
          <div className="col-lg-6 order-1 order-lg-2"><img src="img/Macbook.png" alt="..." className="img-fluid" /></div>
        </div>
      </div>
    </section>
    <section id="browser" className="browser">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="h3 mb-5">How it works</h2>
            <div className="browser-mockup">
              <div id="nav-tabContent" className="tab-content">
                <div id="nav-first" role="tabpanel" aria-labelledby="nav-first-tab" className="tab-pane fade show active"><img src="img/preview-3.png" alt="..." className="img-fluid" /></div>
                <div id="nav-second" role="tabpanel" aria-labelledby="nav-second-tab" className="tab-pane fade"><img src="img/preview-2.png" alt="..." className="img-fluid" /></div>
                <div id="nav-third" role="tabpanel" aria-labelledby="nav-third-tab" className="tab-pane fade"><img src="img/preview-1.png" alt="..." className="img-fluid" /></div>
              </div>
            </div>
          </div>
        </div>
        <div id="myTab" role="tablist" className="nav nav-tabs">
          <div className="row">
            <div className="col-md-4"><a id="nav-first-tab" data-toggle="tab" href="#nav-first" role="tab" aria-controls="nav-first" aria-expanded="true" className="nav-item nav-link active"> <span className="number">1</span>Choose any website to turn into an interactive pinboard for feedback</a></div>
            <div className="col-md-4"><a id="nav-second-tab" data-toggle="tab" href="#nav-second" role="tab" aria-controls="nav-second" className="nav-item nav-link"> <span className="number">2</span>Choose any website to turn into an interactive pinboard for feedback</a></div>
            <div className="col-md-4"><a id="nav-third-tab" data-toggle="tab" href="#nav-third" role="tab" aria-controls="nav-third" className="nav-item nav-link"> <span className="number">3</span>Choose any website to turn into an interactive pinboard for feedback</a></div>
          </div>
        </div>
      </div>
    </section>
    <section id="about-us" className="about-us bg-gray">
      <div className="container">
        <h2>About Us</h2>
        <div className="row">
          <p className="lead col-lg-10">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. or randomised words which don't look even slightly believable. </p>
        </div><a href="#" className="btn btn-primary btn-shadow btn-gradient">Discover More</a>
      </div>
    </section>
    <section id="features" className="features">
      <div className="container">
        <div className="row d-flex align-items-center">
          <div className="text col-lg-6 order-2 order-lg-1">
            <div className="icon"><img src="img/medal.svg" alt="..." className="img-fluid" /></div>
            <h4>Your peace of mind is our business</h4>
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. </p><a href="#" className="btn btn-primary btn-shadow btn-gradient">View More</a>
          </div>
          <div className="image col-lg-6 order-1 order-lg-2"><img src="img/feature-1.png" alt="..." className="img-fluid" /></div>
        </div>
        <div className="row d-flex align-items-center">
          <div className="image col-lg-6"><img src="img/feature-2.png" alt="..." className="img-fluid" /></div>
          <div className="text col-lg-6">
            <div className="icon"><img src="img/hourglass.svg" alt="..." className="img-fluid" /></div>
            <h4>Your peace of mind is our business</h4>
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. </p><a href="#" className="btn btn-primary btn-shadow btn-gradient">View More</a>
          </div>
        </div>
        <div className="row d-flex align-items-center">
          <div className="text col-lg-6 order-2 order-lg-1">
            <div className="icon"><img src="img/cup.svg" alt="..." className="img-fluid" /></div>
            <h4>Your peace of mind is our business</h4>
            <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. </p><a href="#" className="btn btn-primary btn-shadow btn-gradient">View More</a>
          </div>
          <div className="image col-lg-6 order-1 order-lg-2"><img src="img/feature-3.png" alt="..." className="img-fluid" /></div>
        </div>
      </div>
    </section>
    <section id="extra-features" className="extra-features bg-primary">
      <div className="container text-center">
        <header>
          <h2>More great features             </h2>
          <div className="row">
            <p className="lead col-lg-8 mx-auto">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</p>
          </div>
        </header>
        <div className="grid row">
          <div className="item col-lg-4 col-md-6">
            <div className="icon"> <i className="icon-diploma"></i></div>
            <h3 className="h5">Lorem Ipsum Dolor</h3>
            <p>Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
          </div>
          <div className="item col-lg-4 col-md-6">
            <div className="icon"> <i className="icon-folder-1"></i></div>
            <h3 className="h5">Lorem Ipsum Dolor</h3>
            <p>Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
          </div>
          <div className="item col-lg-4 col-md-6">
            <div className="icon"> <i className="icon-gears"></i></div>
            <h3 className="h5">Lorem Ipsum Dolor</h3>
            <p>Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
          </div>
          <div className="item col-lg-4 col-md-6">
            <div className="icon"> <i className="icon-management"></i></div>
            <h3 className="h5">Lorem Ipsum Dolor</h3>
            <p>Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
          </div>
          <div className="item col-lg-4 col-md-6">
            <div className="icon"> <i className="icon-pie-chart"></i></div>
            <h3 className="h5">Lorem Ipsum Dolor</h3>
            <p>Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
          </div>
          <div className="item col-lg-4 col-md-6">
            <div className="icon"> <i className="icon-quality"></i></div>
            <h3 className="h5">Lorem Ipsum Dolor</h3>
            <p>Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
          </div>
        </div>
      </div>
    </section>
    <section id="testimonials" className="testimonials">
      <div className="container">
        <header className="text-center no-margin-bottom">
          <h2>Happy Clients</h2>
          <p className="lead">There are many variations of passages of Lorem Ipsum available, but the majority have</p>
        </header>
        <div className="owl-carousel owl-theme testimonials-slider">
          <div className="item-holder">
            <div className="item">
              <div className="avatar"><img src="img/avatar-3.jpg" alt="..." className="img-fluid" /></div>
              <div className="text">
                <div className="quote"><img src="img/quote.svg" alt="..." className="img-fluid" /></div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p><strong className="name">Jessica Watson</strong>
              </div>
            </div>
          </div>
          <div className="item-holder">
            <div className="item">
              <div className="avatar"><img src="img/avatar-5.jpg" alt="..." className="img-fluid" /></div>
              <div className="text">
                <div className="quote"><img src="img/quote.svg" alt="..." className="img-fluid" /></div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p><strong className="name">Sarrah Wood</strong>
              </div>
            </div>
          </div>
          <div className="item-holder">
            <div className="item">
              <div className="avatar"><img src="img/avatar-3.jpg" alt="..." className="img-fluid" /></div>
              <div className="text">
                <div className="quote"><img src="img/quote.svg" alt="..." className="img-fluid" /></div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p><strong className="name">Jessica Watson</strong>
              </div>
            </div>
          </div>
          <div className="item-holder">
            <div className="item">
              <div className="avatar"><img src="img/avatar-5.jpg" alt="..." className="img-fluid" /></div>
              <div className="text">
                <div className="quote"><img src="img/quote.svg" alt="..." className="img-fluid" /></div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p><strong className="name">Sarrah Wood</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="newsletter" className="newsletter bg-gray">
      <div className="container text-center">
        <h2>Subscribe to Newsletter</h2>
        <p className="lead">There are many variation passages of lorem ipsum, but the majority have</p>
        <div className="form-holder">
          <form id="newsletterForm" action="#">
            <div className="form-group">
              <input type="email" name="email" id="email" placeholder="Enter Your Email Address" />
              <button type="submit" className="btn btn-primary btn-gradient submit">Subscribe</button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <div id="scrollTop">
      <div className="d-flex align-items-center justify-content-end"><i className="fa fa-long-arrow-up"></i>To Top</div>
    </div>
    <footer className="main-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6"><a href="#" className="brand">Landy</a>
            <ul className="contact-info list-unstyled">
              <li><a href="mailto:sales@landy.com">Sales@Landy.com</a></li>
              <li><a href="tel:123456789">+00 123 456 789</a></li>
            </ul>
            <ul className="social-icons list-inline">
              <li className="list-inline-item"><a href="#" target="_blank" title="Facebook"><i className="fa fa-facebook"></i></a></li>
              <li className="list-inline-item"><a href="#" target="_blank" title="Twitter"><i className="fa fa-twitter"></i></a></li>
              <li className="list-inline-item"><a href="#" target="_blank" title="Instagram"><i className="fa fa-instagram"></i></a></li>
              <li className="list-inline-item"><a href="#" target="_blank" title="Pinterest"><i className="fa fa-pinterest"></i></a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Selected Cases</h5>
            <ul className="links list-unstyled">
              <li> <a href="#">Guess Conntect</a></li>
              <li> <a href="#">Postly</a></li>
              <li> <a href="#">Iris Vor Arnim</a></li>
              <li> <a href="#">Yapital</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Selected Cases</h5>
            <ul className="links list-unstyled">
              <li> <a href="#">Guess Conntect</a></li>
              <li> <a href="#">Postly</a></li>
              <li> <a href="#">Iris Vor Arnim</a></li>
              <li> <a href="#">Yapital</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Selected Cases</h5>
            <ul className="links list-unstyled">
              <li> <a href="#">Guess Conntect</a></li>
              <li> <a href="#">Postly</a></li>
              <li> <a href="#">Iris Vor Arnim</a></li>
              <li> <a href="#">Yapital</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="copyrights">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <p>&copy; 2017 Landy.com. All rights reserved.                        </p>
            </div>
            <div className="col-md-5 text-right">

            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>

        return (
          <div>
            <Navbar logged_in={false} />
          <Wrapper loaded={true} content={content} />
          </div>
        );
    }
}



export default Home;
