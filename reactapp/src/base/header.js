import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#"><img src='/static/images/logo.png' style={{height: "40px"}} /></a>

                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/pages/">Page List</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/components/">Component List</a>
                        </li>
                        
                    </ul>
                </div>
            </nav>
        );
    }
}



export default Header;
