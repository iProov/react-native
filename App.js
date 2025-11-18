import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  SafeAreaView,
  NativeEventEmitter
} from 'react-native'
import IProov from '@iproov/react-native'
import ApiClient, {
  CLAIM_TYPE_ENROL,
  ASSURANCE_TYPE_GENUINE_PRESENCE,
  ASSURANCE_TYPE_LIVENESS
} from './ApiClient.js'
import uuid from 'react-native-uuid'
import RNProgressHud from 'progress-hud'
import config from './credentials.js'

export default class App extends Component {
  apiClient = new ApiClient(
    'https://' + config.baseUrl + '/api/v2/',
    config.apiKey,
    config.secret
  )

  launchIProov = async () => {
    RNProgressHud.showWithStatus('Getting token')
    const response = await this.apiClient.getToken(
      ASSURANCE_TYPE_LIVENESS,
      CLAIM_TYPE_ENROL,
      uuid.v4()
    )

    const body = await response.json()

    RNProgressHud.dismiss()

    if (!response.ok) {
      Alert.alert('API Client Error', body.error_description)
      return
    }

    var options = new IProov.Options()
    options.enableScreenshots = true
    
    const eventEmitter = new NativeEventEmitter(IProov.IProovReactNative)

    IProov.launch('wss://' + config.baseUrl + '/ws', body.token, options, eventEmitter, (event) => {
      switch (event.name) {
        case IProov.EVENT_CONNECTING:
          RNProgressHud.showWithStatus('Connecting')
          break
  
        case IProov.EVENT_CONNECTED:
          RNProgressHud.dismiss()
          break
  
        case IProov.EVENT_PROCESSING:
          RNProgressHud.showProgressWithStatus(
            event.params.progress,
            event.params.message
          )
          break
  
        case IProov.EVENT_CANCELED:
          RNProgressHud.showErrorWithStatus('Canceled by ' + event.params.canceler)
          break
  
        case IProov.EVENT_FAILURE:
          // Log all reasons with their feedback codes
          if (event.params.reasons && Array.isArray(event.params.reasons)) {
            console.log('Failure reasons:')
            event.params.reasons.forEach((reasonObj, index) => {
              console.log(`  ${index + 1}. Feedback Code: ${reasonObj.feedbackCode}, Reason: ${reasonObj.description}`)
            })
            
            // Show first reason or summary
            const firstReason = event.params.reasons[0]
            const message = event.params.reasons.length > 1
              ? `Failed: ${firstReason.description} (+ ${event.params.reasons.length - 1} more)`
              : `Failed: ${firstReason.description}`
            
            RNProgressHud.showErrorWithStatus(message)
          } else {
            RNProgressHud.showErrorWithStatus('Failed: Unknown error')
          }
          break
  
        case IProov.EVENT_SUCCESS:
          RNProgressHud.showSuccessWithStatus('Success')
          break
  
        case IProov.EVENT_ERROR:
          RNProgressHud.showErrorWithStatus('Error: ' + event.params.reason)
          break
      }
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.toolbar}>
            <Text style={styles.welcome}>iProov Example</Text>
          </View>
          <View style={styles.contentContainer}>
            <Button
              onPress={this.launchIProov}
              title="🚀 Launch"
              color="#841584"
            />
          </View>
        </SafeAreaView>
        {/* Change bottom safe area background color */}
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5FCFF' }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 9,
    backgroundColor: '#4998f2'
  },
  toolbar: {
    flex: 1,
    backgroundColor: '#4998f2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    color: 'white'
  }
})
