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
import IProovReactNative from 'iproov-react-native';
import { getToken } from './apiClient.js'

export default class App extends Component<{}> {

  state = {
    status: 'starting',
    message: '--'
  };

  componentDidMount() {
    this.registerListeners();
  }

  registerListeners() {
    const eventEmitter = new NativeEventEmitter(IProovReactNative);
    eventEmitter.addListener('iproov_connecting', (event) => {
      console.log('connecting: ' + JSON.stringify(event));
      this.setState({
        status: "connecting",
        message: ''
      });
    });

    eventEmitter.addListener('iproov_connected', (event) => {
      console.log('connected ' + JSON.stringify(event));
      this.setState({
        status: "connected",
        message: ''
      });
    });

    eventEmitter.addListener('iproov_processing', (event) => {
      console.log('processing ' + JSON.stringify(event));
      this.setState({
        status: "processing",
        message: '' + event.progress +'${event.message}'
      });
    });

    eventEmitter.addListener('iproov_success', (event) => {
      console.log('success ' + JSON.stringify(event));
      this.setState({
        status: "success",
        message: ''
      });
    });

    eventEmitter.addListener('iproov_failure', (event) => {
      console.log('failure ' + JSON.stringify(event));
      this.setState({
        status: "failure",
        message: event.reason
      })
    });

    eventEmitter.addListener('iproov_error', (event) => {
      console.log('error ' + JSON.stringify(event));
      this.setState({
        status: "error",
        message: '' + event.reason
      })
    });

    eventEmitter.addListener('iproov_cancelled', (event) => {
      console.log('cancelled ' + JSON.stringify(event));
      this.setState({
        status: "cancelled",
        message: ''
      });
    });
  }

  launchIProov() {
    getToken("genuine_presence", 'verify', 'laolu.animashaun@iproov.com').then(data => {
      console.log('Launching iProov with token: ' + data.token);
      let options = {
        ui: {
            filter: 'shaded'
        }
      }
      IProovReactNative.launch(data.token, 'https://beta.rp.secure.iproov.me/api/v2/', JSON.stringify(options));
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆IProovReactNative example☆</Text>
        <Text style={styles.instructions}>STATUS: {this.state.status}</Text>
        <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
        <Text style={styles.instructions}>{this.state.message}</Text>
        <Button
          onPress={this.launchIProov}
          title="Launch"
          color="#841584"/>
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
