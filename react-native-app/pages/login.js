import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';

class LogIn extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
		  username: '',
		  password: '',
			error: '',
		}
		this.formSubmitCallback = this.formSubmitCallback.bind(this);
  }

	componentDidMount() {
		if (this.props.userId) {
			this.props.setGlobalState('page','myLeagues')
		}
	}

    setGlobalState(state) {
        console.log("New Global State", state)
        if (this.props.autoSetGlobalState == true) {
            this.props.setGlobalState(this.props.globalStateName,state)
        }
    }

    handleChange(name,value) {
        var newState = {};
        newState[name] = value;
        var newCompleteState = this.state;
        newCompleteState[name] = value;
        this.setState(newState, this.setGlobalState(newCompleteState));
    }

	formSubmit() {
    var data = {'email':this.state.email, 'password':this.state.password}

    ajaxWrapper('POST','/users/logIn/',data, this.formSubmitCallback)
		this.setState({'error':'Sending Ajax'})
	}

  async formSubmitCallback(value) {
				console.log("Value",value);
				if ('error' in value) {
					this.setState({error:value['error']})
				}
				else{
				var userId = value[0]['user']['id'].toString();
	      await AsyncStorage.setItem('userId', userId);
				this.props.setGlobalState('userId',userId)
				this.props.setGlobalState('page','myLeagues')
			}
  }


    render() {


        return (
          <View>

                      <InputGroup>
                          <Item floatingLabel>
                          <Label>Email</Label>
                          <Input placeholder="" onChangeText={(text) => this.handleChange('email',text)}/>
                          </Item>
                      </InputGroup>

                      <InputGroup>
                          <Item floatingLabel>
                          <Label>Password</Label>
                          <Input placeholder="" onChangeText={(text) => this.handleChange('password',text)} secureTextEntry={true}/>
                          </Item>
                      </InputGroup>


                <Button onPress={() => this.formSubmit()} full>
                  <Text>Log In</Text>
                </Button>

                <Button success={true} onPress={() => this.props.setGlobalState('page','signUp')} full>
                  <Text>No Account? Sign Up</Text>
                </Button>
								<Text>{this.state.error}</Text>

            </View>
        );
    }
}

export default LogIn;
