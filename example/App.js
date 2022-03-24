
import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import IProov from 'iproov-react-native'
import { ApiClient } from './apiClient.js'
import uuid from 'react-native-uuid'
import  RNProgressHud  from  'progress-hud'

export default class App extends Component {

  config = {
    baseUrl : 'https://beta.rp.secure.iproov.me/api/v2',
    apiKey: '<< API_KEY >>',
    secret: '<< SECRET >>'
  }

  apiClient = new ApiClient(this.config)

  launchIProov = async () => {
    RNProgressHud.showWithStatus("Getting token")
    let response = await this.apiClient.getToken('liveness', 'enrol', uuidv4())

      let body = await response.json()
      console.log(`API Client response: '${JSON.stringify(body)}`)
      
      if(!response.ok) {
        RNProgressHud.dismiss()
        console.log(`API Client error response: ${JSON.stringify(body)}`)
        Alert.alert('API Client Error', body.error_description)
        return
      }

      console.log('Launching with token: ' + body.token);

      let options = new IProov.Options()
      options.ui.filter = IProov.Options.SHADED

      IProov.launch(this.config.baseUrl, body.token, options, (e) => this.eventHandler(e));
  }
  
  enrolPhotoAndLaunchIProov = async () => {
    let response = await this.apiClient.enrolPhotoAndGetVerifyToken(uuidv4(), 'liveness', testPhoto, 'oid')
    let body = await response.json()
    
    if(!response.ok) {
      RNProgressHud.dismiss()
      console.log(`API Client error response: ${JSON.stringify(body)}`)
      Alert.alert('API Client Error', body.error_description)
      return
    }

    console.log(`Launching iProov with token: ${body.token}`)
    
    let options = new IProov.Options()
    options.ui.filter = IProov.Options.VIBRANT

    IProov.launch(this.config.baseUrl, body.token, options, (e) => this.eventHandler(e));
  }

  eventHandler(iproovEvent) {
    console.log(iproovEvent)
    
    switch(iproovEvent.event) {
      case IProov.CONNECTED_EVENT:
        RNProgressHud.showWithStatus("Connected")
        break
      
      case IProov.CONNECTING_EVENT:
        RNProgressHud.showWithStatus("Connecting")
        break

      case IProov.PROCESSING_EVENT:
        RNProgressHud.showProgressWithStatus(iproovEvent.params.progress, iproovEvent.params.message)
        break  
      
      case IProov.CANCELLED_EVENT:
        RNProgressHud.dismiss()
        Alert.alert('Result', 'Cancelled')
        break

      case IProov.FAILURE_EVENT:
        RNProgressHud.dismiss()
        Alert.alert('Result', 'Failure')
        break
        
      case IProov.SUCCESS_EVENT:
        RNProgressHud.dismiss()
        Alert.alert('Result', 'Success')
        break

      case IProov.ERROR_EVENT:
        console.log(iproovEvent)
        RNProgressHud.dismiss()
        Alert.alert('Result', 'Error')
        break
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>IProov Example</Text>
    
        <Button
          onPress={this.launchIProov}
          title='🚀 Launch'
          color='#841584'/>
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
  }
});

function uuidv4() {
  return uuid.v4()
}

// Generated from https://elmah.io/tools/base64-image-encoder/
const testPhoto = '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'