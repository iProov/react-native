
import { NativeModules, NativeEventEmitter } from 'react-native';
const { IProovReactNative } = NativeModules;
export const { CONNECTING_EVENT, CONNECTED_EVENT, PROCESSING_EVENT, SUCCESS_EVENT, FAILURE_EVENT, CANCELLED_EVENT, ERROR_EVENT } = IProovReactNative.getConstants();

export { Options } from './options.js'

let emitter = null

export function launch(baseUrl, token, options, listener) {
    registerDelegateListeners(listener)
    IProovReactNative.launch(baseUrl, token, JSON.stringify(options.sanitize()));
}

function getNativeEventEmitterInstace() {
    if(emitter == null) {
        emitter = new NativeEventEmitter(IProovReactNative);
    }
    return emitter
}

function registerDelegateListeners(listener) {
    const eventEmitter = getNativeEventEmitterInstace()
    eventEmitter.addListener(CONNECTING_EVENT, (event) => {
      listener({ event: CONNECTING_EVENT, 
        params: event
      })
    });

    eventEmitter.addListener(CONNECTED_EVENT, (event) => {
      listener({
        event: CONNECTED_EVENT, 
        params: event
      })
    });

    eventEmitter.addListener(PROCESSING_EVENT, (event) => {
      listener({
        event: PROCESSING_EVENT, 
        params: event
      })
    });

    eventEmitter.addListener(SUCCESS_EVENT, (event) => {
      listener({
        event: SUCCESS_EVENT, 
        params: event
      })
    });

    eventEmitter.addListener(FAILURE_EVENT, (event) => {
      listener({
        event: FAILURE_EVENT, 
        params: event
      })
    });

    eventEmitter.addListener(ERROR_EVENT, (event) => {
      listener({
        event: ERROR_EVENT, 
        params: event
      })
    });

    eventEmitter.addListener(CANCELLED_EVENT, (event) => {
      listener({
        event: CANCELLED_EVENT, 
        params: event
      })
    });
  }