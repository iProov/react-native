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

function getNativeEventEmitterInstance() {
  if (emitter == null) {
    emitter = new NativeEventEmitter(IProovReactNative)
  }
  return emitter
}

function registerDelegateListeners(listener) {
  const eventEmitter = getNativeEventEmitterInstance()
  const events = [
    EVENT_CONNECTING,
    EVENT_CONNECTED,
    EVENT_PROCESSING,
    EVENT_SUCCESS,
    EVENT_FAILURE,
    EVENT_CANCELLED,
    EVENT_ERROR
  ]

  const terminalEvents = [
    EVENT_SUCCESS,
    EVENT_FAILURE,
    EVENT_CANCELLED,
    EVENT_ERROR
  ]

  events.forEach((eventType) => {
    eventEmitter.addListener(eventType, (event) => {
      listener({
        event: eventType,
        params: event
      })

      if (terminalEvents.includes(eventType)) {
        removeAllListeners(eventEmitter)
      }
    })
  })
}

function removeAllListeners(eventEmitter) {
  eventEmitter.removeAllListeners(EVENT_CONNECTING)
  eventEmitter.removeAllListeners(EVENT_CONNECTED)
  eventEmitter.removeAllListeners(EVENT_PROCESSING)
  eventEmitter.removeAllListeners(EVENT_SUCCESS)
  eventEmitter.removeAllListeners(EVENT_FAILURE)
  eventEmitter.removeAllListeners(EVENT_CANCELLED)
  eventEmitter.removeAllListeners(EVENT_ERROR)
}
