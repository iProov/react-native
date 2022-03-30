import { NativeModules, NativeEventEmitter } from 'react-native'
import { objectToSnakeCase } from './Utils.js'
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
  const events = [
    EVENT_CONNECTING,
    EVENT_CONNECTED,
    EVENT_PROCESSING,
    EVENT_SUCCESS,
    EVENT_FAILURE,
    EVENT_CANCELLED
  ]

  events.forEach((eventType) => {
    eventEmitter.addListener(eventType, (event) => {
      listener({
        event: eventType,
        params: event
      })
    })
  })
}
