import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import ajaxWrapper from '../../base/ajax.js';
import { Toast, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label } from 'native-base';

class SignUp extends React.Component {
	constructor(props){
		super(props)

		this.state = {
		  email: 'Pre Query',
		  password: '',
			password_confirm: '',
			error: '',
			full_name: '',
		}

		this.formSubmit = this.formSubmit.bind(this);
		this.formSubmitCallback = this.formSubmitCallback.bind(this);
		this.logIn = this.logIn.bind(this);
  }

    handleChange(name,value) {
        var newState = {};
        newState[name] = value;
        var newCompleteState = this.state;
        newCompleteState[name] = value;
        this.setState(newState);
    }

	formSubmit() {
			if (this.state.password == this.state.password_confirm) {
		    var data = {'email':this.state.email, 'password':this.state.password, 'first_name':this.state.full_name}
		    ajaxWrapper('POST','/api/user/user/',data, this.formSubmitCallback)
			}
			else {
				this.setState({error:'Your Passwords Dont Match'})
			}
	}

	async logIn(userId) {
			var userId = userId.toString();
      await AsyncStorage.setItem('userId', userId);
			this.props.setGlobalState('userId',userId);
			this.props.setGlobalState('page','logIn');
	}

  formSubmitCallback(value) {
    this.logIn(value[0]['user']['id'])
  }


    render() {


        return (
          <View>
					<InputGroup>
							<Item floatingLabel>
							<Label>Name</Label>
							<Input placeholder="" onChangeText={(text) => this.handleChange('full_name',text)}/>
							</Item>
					</InputGroup>
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

                      <InputGroup>
													<Item floatingLabel>
													<Label>Confirm Your Password</Label>
                          <Input placeholder="" onChangeText={(text) => this.handleChange('password_confirm',text)} secureTextEntry={true}/>
													</Item>
                      </InputGroup>


                <Button onPress={this.formSubmit} full>
                  <Text>Sign Up</Text>
                </Button>

								<Button success={true} onPress={() => this.props.setGlobalState('page','logIn')} full>
                  <Text>Have An Account? Log In</Text>
                </Button>
								<Text>{this.state.error}</Text>

            </View>
        );
    }
}

export default SignUp;
