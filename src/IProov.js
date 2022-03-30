import { NativeModules, NativeEventEmitter } from 'react-native'
import { objectToSnakeCase } from './utils.js'
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
  const formattedOptions = objectToSnakeCase(options)
  IProovReactNative.launch(baseUrl, token, JSON.stringify(formattedOptions))
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
    removeAllListeners(eventEmitter)
  })

  eventEmitter.addListener(EVENT_FAILURE, (event) => {
    listener({
      event: EVENT_FAILURE,
      params: event
    })
    removeAllListeners(eventEmitter)
  })

  eventEmitter.addListener(EVENT_ERROR, (event) => {
    listener({
      event: EVENT_ERROR,
      params: event
    })
    removeAllListeners(eventEmitter)
  })

  eventEmitter.addListener(EVENT_CANCELLED, (event) => {
    listener({
      event: EVENT_CANCELLED,
      params: event
    })
    removeAllListeners(eventEmitter)
  })
}

function removeAllListeners(eventEmitter) {
  eventEmitter.removeAllListeners(EVENT_CONNECTING)
  eventEmitter.removeAllListeners(EVENT_CONNECTED)
  eventEmitter.removeAllListeners(EVENT_PROCESSING)
  eventEmitter.removeAllListeners(EVENT_SUCCESS)
  eventEmitter.removeAllListeners(EVENT_FAILURE)
  eventEmitter.removeAllListeners(EVENT_CANCELLED)
}
