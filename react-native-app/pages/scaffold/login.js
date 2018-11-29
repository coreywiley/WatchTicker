import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../../base/ajax.js';
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
		this.loadUser = this.loadUser.bind(this);
  }

	componentDidMount() {
		if (this.props.userId) {
			this.props.setGlobalState('page','onboarding')
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

    ajaxWrapper('POST','/users/token/',data, this.formSubmitCallback)
		this.setState({'error':'Sending Authentication Request'})
	}

  async formSubmitCallback(value) {
				console.log("Value",value);
				if ('error' in value) {
            if (value['error'] == 'Bad Request') {
              this.setState({error: 'Wrong Email or Password.'})
            }
            else {
              this.setState({error:value['error']})
            }
        }
				else if (!value['access']) {
					this.setState({error: 'Wrong Email or Password.'})
				}
				else{
					console.log("User",value);
					await AsyncStorage.setItem('token',value['access']);
					await AsyncStorage.setItem('refresh_token',value['refresh']);
					this.props.setGlobalState('token',value['access'])
					this.props.setGlobalState('refresh_token',value['refresh'])
					ajaxWrapper("GET", "/users/user/", {}, this.loadUser);

			}

  }

	loadUser(result) {
		console.log("User", result);
		this.props.setGlobalState('user',result)
		//this.props.setGlobalState('page','onboarding')
	}


    render() {


        return (
          <View>

                      <InputGroup>
                          <Item stackedLabel>
                          <Label>Email</Label>
                          <Input placeholder="" onChangeText={(text) => this.handleChange('email',text)}/>
                          </Item>
                      </InputGroup>

                      <InputGroup>
                          <Item stackedLabel>
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
