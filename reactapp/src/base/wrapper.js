import React, { Component } from 'react';
import {Image, Button, Navbar} from 'library';

class Wrapper extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        var loading = <div style={{'textAlign':'center'}}> <Image css={{'width':'100px'}} src={'../../static/images/loading.gif'} /></div>;
        var css = {
            'paddingLeft':'2px',
            'paddingRight':'2px',
        };
        if (this.props.css) {
            css = this.props.css;
        } else if (this.props.navbar){
            css['marginTop'] = '67px';
            css['paddingTop'] = '10px';
        }

        var links = [];
        if (!this.props.logOut){
            var links = [
                [null, <Button href={'/logIn/'} text={"Log In"} type={'primary'} />],
                [null, <Button href={'/signUp/'} text={"Sign Up"} type={'success'} />]
            ];
        }

        var logo = <h3>EE Magic</h3>;
        var nav = <Navbar fixed={true} token={this.props.token} nameLink='/' name={logo} links={links} logOut={this.props.logOut} />

        return (
            <div>
                {(this.props.navbar) ? nav : null}
                <div className="container-fluid" style={css}>
                        {(this.props.loaded) ? this.props.content : loading}
                </div>
            </div>
        );
    }
}

export default Wrapper;
