import React from 'react';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <footer class="footer">
                <div class="container">
                    <div style={{float:"right"}}>
                        <ul className="footer-list">
                            <li className=""><a href="/">HOME</a></li>
                        </ul>
                    </div>

                    <div style={{textAlign: "center"}} >
                        <span class="text-muted">Welcome to the bottom of the page</span>
                    </div>

                    <a href="/" style={{float: "left"}}>
                        <img src={"/static/images/logo.png"} style={{height:"60px"}} alt="logo" />
                    </a>
                    <div style={{clear:"both"}}></div>
                </div>
            </footer>
        );
    }
}


export default Footer;
