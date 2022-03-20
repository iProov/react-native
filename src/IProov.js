
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
      console.log('connecting: ' + JSON.stringify(event));
      listener(event)
    });

    eventEmitter.addListener(CONNECTED_EVENT, (event) => {
      console.log('connected ' + JSON.stringify(event));
      listener(event)
    });

    eventEmitter.addListener(PROCESSING_EVENT, (event) => {
      console.log('processing ' + JSON.stringify(event));
      listener(event)
    });

    eventEmitter.addListener(SUCCESS_EVENT, (event) => {
      console.log('SUCCESS ' + JSON.stringify(event));
      listener(event)
    });

    eventEmitter.addListener(FAILURE_EVENT, (event) => {
      console.log('failure ' + JSON.stringify(event));
      listener(event)
    });

    eventEmitter.addListener(ERROR_EVENT, (event) => {
      console.log('error ' + JSON.stringify(event));
      listener(event)
    });

    eventEmitter.addListener(CANCELLED_EVENT, (event) => {
      console.log('cancelled ' + JSON.stringify(event));
      listener(event)
    });
  }