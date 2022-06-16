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
  const formattedOptions = formatOptions(options)
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
  eventEmitter.removeAllListeners(EVENT_CANCELLED)
  eventEmitter.removeAllListeners(EVENT_ERROR)
}

function formatOptions(options) {
  options.ui.lineColor = rgba2argb(options.ui.lineColor)
  options.ui.backgroundColor = rgba2argb(options.ui.backgroundColor)
  options.ui.headerBackgroundColor = rgba2argb(options.ui.headerBackgroundColor)
  options.ui.footerBackgroundColor = rgba2argb(options.ui.footerBackgroundColor)
  options.ui.headerTextColor = rgba2argb(options.ui.headerTextColor)
  options.ui.footerTextColor = rgba2argb(options.ui.footerTextColor)
  options.ui.promptTextColor = rgba2argb(options.ui.promptTextColor)
  options.ui.closeButtonTintColor = rgba2argb(options.ui.closeButtonTintColor)

  options.ui.genuinePresenceAssurance.notReadyTintColor = rgba2argb(options.ui.genuinePresenceAssurance.notReadyTingColor)
  options.ui.genuinePresenceAssurance.readyTintColor = rgba2argb(options.ui.genuinePresenceAssurance.readyTintColor)
  options.ui.genuinePresenceAssurance.progressBarColor = rgba2argb(options.ui.genuinePresenceAssurance.progressBarColor)

  options.ui.livenessAssurance.primaryTintColor = rgba2argb(options.ui.livenessAssurance.primaryTintColor)
  options.ui.livenessAssurance.secondaryTintColor = rgba2argb(options.ui.livenessAssurance.secondaryTintColor)

  return objectToSnakeCase(options)
}

function rgba2argb(hex) {
  if(hex == null) return null

  let color = hex.slice(1, 8)
  let alpha = hex.slice(-2)

  return '#' + alpha + color
}