import { NativeModules} from 'react-native'
import { objectToSnakeCase, convertColorsToARGB } from './Utils.js'
export const { IProovReactNative } = NativeModules
export const {
  EVENT_CONNECTING,
  EVENT_CONNECTED,
  EVENT_PROCESSING,
  EVENT_SUCCESS,
  EVENT_FAILURE,
  EVENT_CANCELED,
  EVENT_ERROR
} = IProovReactNative.getConstants()

export { Options } from './Options.js'

let emitter = null

export function launch(baseUrl, token, options, appEmitter, listener) {
  registerDelegateListeners(appEmitter, listener)
  const snakeCaseOptions = objectToSnakeCase(options)
  const snakeCaseOptionsWithARGBColors = convertColorsToARGB(snakeCaseOptions)
  IProovReactNative.launch(baseUrl, token, JSON.stringify(snakeCaseOptionsWithARGBColors))
}

export function cancel() {
  IProovReactNative.cancel()
}

function getNativeEventEmitterInstance(appEmitter) {
  if (emitter != null) {
    removeAllListeners(emitter)
  }
  emitter = appEmitter
  return emitter
}

function registerDelegateListeners(appEmitter, listener) {
  const eventEmitter = getNativeEventEmitterInstance(appEmitter)
  const events = [
    EVENT_CONNECTING,
    EVENT_CONNECTED,
    EVENT_PROCESSING,
    EVENT_SUCCESS,
    EVENT_FAILURE,
    EVENT_CANCELED,
    EVENT_ERROR
  ]

  const terminalEvents = [
    EVENT_SUCCESS,
    EVENT_FAILURE,
    EVENT_CANCELED,
    EVENT_ERROR
  ]

  events.forEach((eventType) => {
    eventEmitter.addListener(eventType, (event) => {
      listener({
        name: eventType,
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
  eventEmitter.removeAllListeners(EVENT_CANCELED)
  eventEmitter.removeAllListeners(EVENT_ERROR)
}