import React, { Component } from 'react';
import {ajaxWrapper, resolveVariables} from 'functions';

import {Wrapper, Container, Header, Button, Break} from 'library';

class Home extends Component {

    render() {

        return (<div>
                <Container children={[]} style={{'text-align': 'center', 'margin-top': '20px'}} required={""} >
		            <Header children={[]} style={{color:'white'}} required={""} text={"Welcome To Watch Ticker"} size={2} />
                    <Button children={[]} style={{}} required={""} text={"Log In"} size={2} type={"success"} href={"/login/"} />
                </Container>
		</div>);
    }
}
export default Home;
