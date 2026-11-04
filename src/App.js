import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
  NativeEventEmitter
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import IProov from '@iproov/react-native'
import ApiClient, {
  CLAIM_TYPE_ENROL,
  ASSURANCE_TYPE_GENUINE_PRESENCE,
  ASSURANCE_TYPE_LIVENESS
} from './ApiClient.js'
import uuid from 'react-native-uuid'
import config from './credentials.js'

export default class App extends Component {
  // status: { message, progress?, result?: 'success' | 'error' }
  state = { busy: false, status: { message: 'Tap Launch to start' } }

  apiClient = new ApiClient(
    'https://' + config.baseUrl + '/api/v2/',
    config.apiKey,
    config.secret
  )

  finish = (message, result) => {
    this.setState({ busy: false, status: { message, result } })
  }

  launchIProov = async () => {
    this.setState({ busy: true, status: { message: 'Getting token' } })

    let response, body
    try {
      response = await this.apiClient.getToken(
        ASSURANCE_TYPE_GENUINE_PRESENCE,
        CLAIM_TYPE_ENROL,
        uuid.v4()
      )
      body = await response.json()
    } catch (e) {
      this.finish('Error: ' + e.message, 'error')
      return
    }

    if (!response.ok) {
      this.finish('Error: could not get a token', 'error')
      Alert.alert('API Client Error', body.error_description)
      return
    }

    var options = new IProov.Options()
    options.enableScreenshots = true

    const eventEmitter = new NativeEventEmitter(IProov.IProovReactNative)

    IProov.launch('wss://' + config.baseUrl + '/ws', body.token, options, eventEmitter, (event) => {
      switch (event.name) {
        case IProov.EVENT_CONNECTING:
          this.setState({ status: { message: 'Connecting' } })
          break

        case IProov.EVENT_CONNECTED:
          this.setState({ status: { message: 'Connected' } })
          break

        case IProov.EVENT_PROCESSING:
          this.setState({
            status: { message: event.params.message, progress: event.params.progress }
          })
          break

        case IProov.EVENT_CANCELED:
          this.finish('Canceled by ' + event.params.canceler, 'error')
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

            this.finish(message, 'error')
          } else {
            this.finish('Failed: Unknown error', 'error')
          }
          break

        case IProov.EVENT_SUCCESS:
          this.finish('Success', 'success')
          break

        case IProov.EVENT_ERROR:
          this.finish('Error: ' + event.params.reason, 'error')
          break
      }
    })
  }

  renderStatus() {
    const { busy, status } = this.state

    let indicator = null
    if (status.result === 'success') {
      indicator = <Text style={styles.statusIcon}>✓</Text>
    } else if (status.result === 'error') {
      indicator = <Text style={styles.statusIcon}>✕</Text>
    } else if (status.progress != null) {
      indicator = <Text style={styles.statusIcon}>{Math.round(status.progress * 100)}%</Text>
    } else if (busy) {
      indicator = <ActivityIndicator />
    }

    return (
      <View style={styles.status}>
        {indicator}
        <Text style={styles.statusMessage}>{status.message}</Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={styles.toolbar}>
          <Text style={styles.welcome}>iProov Example</Text>
        </SafeAreaView>
        <View style={styles.contentContainer}>
          {this.renderStatus()}
        </View>
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Button
            onPress={this.launchIProov}
            title="🚀 Launch"
            color="#841584"
            disabled={this.state.busy}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    )
  }
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#4998f2',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  footer: {
    padding: 16,
    paddingBottom: 75,
    backgroundColor: '#F5FCFF'
  },
  status: {
    height: 60,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusIcon: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  statusMessage: {
    flexShrink: 1,
    fontSize: 16
  }
})
