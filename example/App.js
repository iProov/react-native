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
import { Platform, StyleSheet, Text, View, NativeEventEmitter } from 'react-native';
import IProovReactNative from 'iproov-react-native';

export default class App extends Component<{}> {
  state = {
    status: 'starting',
    message: '--'
  };
  componentDidMount() {
    // IProovReactNative.sampleMethod('Testing', 123, (message) => {
    //   this.setState({
    //     status: 'native callback received',
    //     message
    //   });
    // });
    registerListeners()
    IProovReactNative.launch();
  }

  fun registerListeners() {
    const eventEmitter = new NativeEventEmitter(IProovReactNative);
    //const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    eventEmitter.addListener('iproov_connecting', (event) => {
      console.log(event.eventProperty);
    });

    eventEmitter.addListener('iproov_connected', (event) => {
      console.log(event.eventProperty);
    });

    eventEmitter.addListener('iproov_processing', (event) => {
      console.log(event.eventProperty);
    });

    eventEmitter.addListener('iproov_success', (event) => {
      console.log(event.eventProperty);
    });

    eventEmitter.addListener('iproov_failure', (event) => {
      console.log(event.eventProperty);
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>☆IProovReactNative example☆</Text>
        <Text style={styles.instructions}>STATUS: {this.state.status}</Text>
        <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
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
