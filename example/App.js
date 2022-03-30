import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import IProov from 'iproov-react-native'
import ApiClient, {
  CLAIM_TYPE_ENROL,
  ASSURANCE_TYPE_LIVENESS
} from './ApiClient.js'
import uuid from 'react-native-uuid'
import RNProgressHud from 'progress-hud'
import config from './credentials.js'

export default class App extends Component {
  apiClient = new ApiClient(config)

  launchIProov = async () => {
    RNProgressHud.showWithStatus('Getting token')
    const response = await this.apiClient.getToken(
      ASSURANCE_TYPE_LIVENESS,
      CLAIM_TYPE_ENROL,
      uuid.v4()
    )

    const body = await response.json()
    console.log(`API Client response: '${JSON.stringify(body)}`)

    if (!response.ok) {
      RNProgressHud.dismiss()
      console.log(`API Client error response: ${JSON.stringify(body)}`)
      Alert.alert('API Client Error', body.error_description)
      return
    }

    console.log('Launching with token: ' + body.token)

    const options = new IProov.Options()
    options.ui.floating_prompt_enabled = true

    IProov.launch(config.baseUrl, body.token, options, (iproovEvent) => {
      console.log(iproovEvent)

      switch (iproovEvent.event) {
        case IProov.EVENT_CONNECTING:
          RNProgressHud.showWithStatus('Connecting')
          break

        case IProov.EVENT_CONNECTED:
          RNProgressHud.dismiss()
          break

        case IProov.EVENT_PROCESSING:
          RNProgressHud.showProgressWithStatus(
            iproovEvent.params.progress,
            iproovEvent.params.message
          )
          break

        case IProov.EVENT_CANCELLED:
          RNProgressHud.dismiss()
          Alert.alert('Result', 'Cancelled')
          break

        case IProov.EVENT_FAILURE:
          RNProgressHud.dismiss()
          Alert.alert('Result', 'Failure')
          break

        case IProov.EVENT_SUCCESS:
          RNProgressHud.dismiss()
          Alert.alert('Result', 'Success')
          break

        case IProov.EVENT_ERROR:
          console.log(iproovEvent)
          RNProgressHud.dismiss()
          Alert.alert('Result', 'Error')
          break
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>iProov Example</Text>

        <Button onPress={this.launchIProov} title="🚀 Launch" color="#841584" />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})
