import React from 'react';
import { StyleSheet, View, AsyncStorage, Image} from 'react-native';
import ajaxWrapper from '../base/ajax.js';
import { Form, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Card, CheckBox, CardItem, List, ListItem, InputGroup, Input, Spinner, Item, Label, Textarea} from 'native-base';
import ButtonSelect from '../library/buttonSelect.js';

class Customize extends React.Component {
  constructor(props) {
      super(props);

      this.state = {'skin_color' : 0, 'size' : 0, 'nipple_color':0, 'masectomy': 0, 'id':null, loaded:false};
      this.objectCallback = this.objectCallback.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);

  }

    componentDidMount(value) {
        ajaxWrapper('GET','/api/home/customize/?user=' + this.props.userId, {}, this.objectCallback);
    }


    handleChange(name,value) {
        var newState = {};
        newState[name] = value;

        this.setState(newState);
    }

    objectCallback(result) {
      if (result.length > 0) {
        var newState = result[0]['customize'];
      }
      else {
        var newState = {}
      }

      newState['loaded'] = true;
      console.log("Object Callback", newState)
      this.setState(newState)
    }

    save() {
      var submitUrl = '/api/home/customize/';
      if (this.state.id != null) {
        submitUrl += this.state.id
      }
      var data = this.state;
      data['user'] = this.props.userId;
      ajaxWrapper('POST',submitUrl, data, () => this.props.setGlobalState('page','journal'))
    }

    render() {


        if (this.state.loaded) {

          var skin_color_options = [1,2,3,4,5,6,7];
          var size_options = [1,2,3,4];
          var nipple_color_options = [1,2,3,4,5,6,7];
          var masectomy_options = [1,2,3];

          var pickerItems = [];
          for (var index in skin_color_options) {
            var value = skin_color_options[index];
            pickerItems.push(<Item><ButtonSelect answer={this.state.skin_color} handleChange={this.handleChange} name={'skin_color'} value={value}/></Item>)
          }

          var skin_color = <View>
            {pickerItems}
          </View>;

          var pickerItems = [];
          for (var index in size_options) {
            var value = size_options[index];
            pickerItems.push(<Item><ButtonSelect answer={this.state.size} handleChange={this.handleChange} name={'size'} value={value}/></Item>)
          }

          var size = <View>
            {pickerItems}
          </View>;

          var pickerItems = [];
          for (var index in nipple_color_options) {
            var value = nipple_color_options[index];
            pickerItems.push(<Item><ButtonSelect answer={this.state.nipple_color} handleChange={this.handleChange} name={'nipple_color'} value={value}/></Item>)
          }

          var nipple_color = <View>
            {pickerItems}
          </View>;


          var pickerItems = [];
          for (var index in masectomy_options) {
            var value = masectomy_options[index];
            pickerItems.push(<Item><ButtonSelect answer={this.state.masectomy} handleChange={this.handleChange} name={'masectomy'} value={value}/></Item>)
          }

          var masectomy = <View>
            {pickerItems}
          </View>;


          return (
              <View>


                <Form>
                  <InputGroup>
                  <View>
                    <Text>Skin Color</Text>
                    {skin_color}
                    </View>
                  <View>
                  <Image source={require('../assets/skybox1.jpg')}  style={{height: 200, width: 200, flex: 1}}/>
                    <Text>Size</Text>
                    {size}
                    </View>
                  <View>
                    <Text>Nipple Color</Text>
                    {nipple_color}
                    </View>
                  <View>
                    <Text>Optional</Text>
                    <Text>Masectomy</Text>
                    {masectomy}
                  </View>
                  <View>
                    <Button success={true} onPress={this.save} full>
                      <Text>Save</Text>
                    </Button>
                    </View>
                  </InputGroup>
                  </Form>
              </View>
          );
        }
        else {
          return (
            <View>
                  <Text>Welcome To Customization</Text>
              </View>
          );
        }

    }
}

export default Customize;
