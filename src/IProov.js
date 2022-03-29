import { NativeModules, NativeEventEmitter } from 'react-native'
const { IProovReactNative } = NativeModules
export const {
  EVENT_CONNECTING,
  EVENT_CONNECTED,
  EVENT_PROCESSING,
  EVENT_SUCCESS,
  EVENT_FAILURE,
  EVENT_CANCELLED,
  EVENT_ERROR
} = IProovReactNative.getConstants()

export { Options } from './Options.js'

let emitter = null

export function launch(baseUrl, token, options, listener) {
  registerDelegateListeners(listener)
  IProovReactNative.launch(baseUrl, token, JSON.stringify(options.sanitize()))
}

function getNativeEventEmitterInstace() {
  if (emitter == null) {
    emitter = new NativeEventEmitter(IProovReactNative)
  }
  return emitter
}

function registerDelegateListeners(listener) {
  const eventEmitter = getNativeEventEmitterInstace()
  eventEmitter.addListener(EVENT_CONNECTING, (event) => {
    listener({ event: EVENT_CONNECTING, params: event })
  })

  eventEmitter.addListener(EVENT_CONNECTED, (event) => {
    listener({
      event: EVENT_CONNECTED,
      params: event
    })
  })

  eventEmitter.addListener(EVENT_PROCESSING, (event) => {
    listener({
      event: EVENT_PROCESSING,
      params: event
    })
  })

  eventEmitter.addListener(EVENT_SUCCESS, (event) => {
    listener({
      event: EVENT_SUCCESS,
      params: event
    })
  })

  eventEmitter.addListener(EVENT_FAILURE, (event) => {
    listener({
      event: EVENT_FAILURE,
      params: event
    })
  })

  eventEmitter.addListener(EVENT_ERROR, (event) => {
    listener({
      event: EVENT_ERROR,
      params: event
    })
  })

  eventEmitter.addListener(EVENT_CANCELLED, (event) => {
    listener({
      event: EVENT_CANCELLED,
      params: event
    })
  })
}
