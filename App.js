import React from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, Button, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const postive = t.refinement(t.Boolean, (b) => b === true);

const User = t.struct({
  firstName: t.String,
  lastName: t.String,
  email: t.String,
  phone: t.Number,
  terms: postive
});

var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup.normal.marginBottom = 0;
  
stylesheet.textbox.normal.marginTop = 5,
stylesheet.textbox.normal.backgroundColor = "#eeeeee";
stylesheet.textbox.error.backgroundColor = "#eeeeee";

stylesheet.controlLabel.normal.color = "#eeeeee";
stylesheet.controlLabel.normal.backgroundColor = 'rgba(0,0,0,0)';

const options= {
  auto: 'placeholders',
  fields: {
    firstName: {
      autoCorrect: false,
      error: "Please enter your First Name."
    },
    lastName: {
      autoCorrect: false,
      error: "Please enter your Last Name."
    },
    email: {
      autoCorrect: false,
      keyboardType: "email-address",
      error: 'Please enter your Email.'
    },
    phone: {
      autoCorrect: false,
      error: 'Please enter a valid Phone Number.'
    },
    terms: {
      label: 'Agree to Terms',
      error: function (value) {
        if(value === false){
          return 'Please Agree to Terms'
        } else {
          true
        }
      }
    }
  },
  stylesheet: stylesheet
};

class Home extends React.Component {
 
  handleSubmit = () => {
    const value = this._form.getValue(); 
    if (value === null){
      console.log('null');
    } 
    else {
      this.setState({ submitting: true });
      
      const firstName = encodeURIComponent(value.firstName);
      const lastName = encodeURIComponent(value.lastName);
      const email = encodeURIComponent(value.email);
      const phone = encodeURIComponent(value.phone);
      const requestBody = "firstName=" + firstName + "&lastName=" + lastName + "&email=" + email + "&phone="  +phone;
      
      console.log(requestBody);

      fetch("yourFetchAddressHere", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' },
        body: requestBody
      }).then((response) => {

          this.setState({ submitting: false });

          let serverReturn = false; 

          let data = {
            result: false,
            message: "waiting for body to be parsed"
          };

          try {
            data = JSON.parse(response._bodyInit);
            serverReturn = true;
          }

          catch (e) {
            serverReturn = false;
            console.log(response);
            alert("can't connect to server. please try again later.");
          }
          
          if(serverReturn){
            if(data.result){
              const { navigate } = this.props.navigation;
              navigate('ThankYou');
            }
            else{
              alert(data.message);
            }
          }         
        }
      ).catch((error) => {
        alert("can't connect to server. please try again later.");
        console.error(error);
      });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
      style={styles.container3}
      behavior="padding"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000',
          }}
        > 
          <Image
            style={styles.container}
            source={require ('./img/yourImgHere.jpg')}
          />         
          <View style={styles.form}> 
            <Form
              ref={c => this._form = c}  
              type={User}
              options={options}
            />  
            <View style={styles.buttonContainer}>
              <Button
                color='#eeeeee'
                title="SUBMIT"                   
                onPress={this.handleSubmit}
              />
            </View>
          </View>
          <Text style={styles.words}>
          *Always need a space for disclaimers when it comes to forms.
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
};

class ThankYou extends React.Component {
  componentDidMount(){
    this.timeoutHandle = setTimeout(()=>{
      const { navigate } = this.props.navigation;
      navigate('Home');
    },5000);
  }

  componentWillUnmount(){
    clearTimeout(this.timeoutHandle);
  }
    
  render(){
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#eee',
        }}
      >
        <Image
            style={styles.container2}
            source={require ('./img/yourImgHere.jpg')}
          />
      </View>
    )
  }
};

const SimpleApp = StackNavigator({
  Home: {
    screen: Home,
    headerMode: 'none',
    navigationOptions: {
      header: null,
    },
  },
  ThankYou: {
    screen: ThankYou,
    headerMode: 'none',
    navigationOptions: {
        header: null,
    },
  },
});

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'contain',
    width: null,
    height: null,
  },
  form: {
    backgroundColor: '#000000',
    marginBottom: null,
    paddingRight: 50,
    paddingLeft: 50,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
    width: null,
    height: null,
  },
  buttonContainer: {
    backgroundColor: '#835942',
    marginTop: 20,
    borderRadius: 5,
    paddingRight: 10,
    paddingLeft: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 10,
    shadowOpacity: 0.25
  },
  words: {
    margin: 24,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#eeeeee',
  },
  container3: {
    backgroundColor: '#000000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});