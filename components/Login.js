import React from 'react';
import { Constants, ImagePicker, Permissions } from 'expo';
import {
  StyleSheet, Text,
  TextInput,  TouchableOpacity, View,
  Button, ImageEditor,
} from 'react-native';
import firebaseSvc from '../FirebaseSvc';
import firebase from 'firebase';
import { auth, initializeApp, storage } from 'firebase';
import uuid from 'uuid';

class Login extends React.Component {
  static navigationOptions = {
    title: 'Scv Chatter',
  };

  state = {
    name: '',
    email: '',
    password: '',
    avatar: '',
  };

  // using Fire.js
  onPressLogin = async () => {
    console.log('pressing login... email:' + this.state.email);
    const email = this.state.email;
    const inicial = email.split(""); 
  
    const user = {
      name: inicial,
      email: this.state.email,
      password: this.state.password,
      avatar: this.state.avatar,
    };

    const response = firebaseSvc.login(
      user,
      this.loginSuccess,
      this.loginFailed
    );
  };

  loginSuccess = () => {
    console.log('login successful, navigate to chat.');
    const email = this.state.email;
    const inicial = email.split("@")[0]; 
    this.props.navigation.navigate('Chat', {
      name: inicial,
      email: this.state.email,
      avatar: this.state.avatar,
    });
  };
  loginFailed = () => {
    console.log('login failed ***');
    alert('Login failure.');
  };


  onChangeTextEmail = email => this.setState({ email });
  onChangeTextPassword = password => this.setState({ password });


  render() {
    return (
      <View>
        <Text style={styles.title}>Email:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="Email"
          onChangeText={this.onChangeTextEmail}
          value={this.state.email}
        />
        <Text style={styles.title}>Password:</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={this.onChangeTextPassword}
          value={this.state.password}
          secureTextEntry={true}
        />
        <Button
          title="Login"
          style={styles.buttonText}
          onPress={this.onPressLogin}
        />

        <Button
          title="Go to create new account"
          style={styles.buttonText}
          onPress={() => this.props.navigation.navigate("CreateAccount")}
        />
      </View>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
    fontSize: offset,
    borderRadius: 10
  },
  buttonText: {
    
    fontSize: 42,
  },
});

export default Login;
