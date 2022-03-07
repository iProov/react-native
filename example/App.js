/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, NativeEventEmitter, Button } from 'react-native';
import IProovReactNative, { Options } from 'iproov-react-native';
import { getToken } from './apiClient.js'
import uuid from 'react-native-uuid'

export default class App extends Component<{}> {

  state = {
    message: '--'
  };

  componentDidMount() {
    this.registerListeners()
  }

  registerListeners() {
    const eventEmitter = new NativeEventEmitter(IProovReactNative);
    eventEmitter.addListener('iproov_connecting', (event) => {
      console.log('connecting: ' + JSON.stringify(event));
      this.setState({
        status: "CONNECTING",
        message: ''
      });
    });

    eventEmitter.addListener('iproov_connected', (event) => {
      console.log('connected ' + JSON.stringify(event));
      this.setState({
        status: "CONNECTED",
        message: ''
      });
    });

    eventEmitter.addListener('iproov_processing', (event) => {
      console.log('processing ' + JSON.stringify(event));
      this.setState({
        message: `PROCESSING: ${event.message} ${event.progress}`
      });
    });

    eventEmitter.addListener('iproov_success', (event) => {
      console.log('SUCCESS ' + JSON.stringify(event));
      this.setState({
        message: ''
      });
    });

    eventEmitter.addListener('iproov_failure', (event) => {
      console.log('failure ' + JSON.stringify(event));
      this.setState({
        message: `FAILURE: ${event.reason}`
      })
    });

    eventEmitter.addListener('iproov_error', (event) => {
      console.log('error ' + JSON.stringify(event));
      this.setState({
        message: `ERROR: ${event.reason}, ${event.message}`
      })
    });

    eventEmitter.addListener('iproov_cancelled', (event) => {
      console.log('cancelled ' + JSON.stringify(event));
      this.setState({
        message: 'CANCELLED'
      });
    });
  }

  launchIProov() {
    getToken("genuine_presence", 'enrol', uuidv4()).then(data => {
      console.log('Launching iProov with token: ' + data.token);
      let options = new Options()
      options.ui.filter = 'shaded'
      // TODO encapsulate the sanitize function
      IProovReactNative.launch('https://beta.rp.secure.iproov.me/api/v2/', data.token, JSON.stringify(options.sanitize()));
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆IProovReactNative example☆</Text>
    
        <Button
          onPress={this.launchIProov}
          title="Launch"
          color="#841584"/>
          <Text style={styles.instructions}>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

function uuidv4() {
  console.log(uuid.v4());
  return uuid.v4()
}