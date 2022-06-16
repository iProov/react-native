package com.iproov.sdk

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import com.iproov.sdk.bridge.OptionsBridge
import com.iproov.sdk.core.exception.IProovException
import com.iproov.sdk.core.exception.InvalidOptionsException

import org.json.JSONException
import org.json.JSONObject

const val EVENT_CONNECTING = "iproov_connecting"
const val EVENT_CONNECTED = "iproov_connected"
const val EVENT_PROCESSING = "iproov_processing"
const val EVENT_SUCCESS = "iproov_success"
const val EVENT_FAILURE = "iproov_failure"
const val EVENT_CANCELLED = "iproov_cancelled"
const val EVENT_ERROR = "iproov_error"

class IProovReactNativeModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private lateinit var listener: IProovReactNativeListener

    override fun getConstants(): Map<String, Any> = mapOf(
        "EVENT_CONNECTING" to EVENT_CONNECTING,
        "EVENT_CONNECTED" to EVENT_CONNECTED, 
        "EVENT_PROCESSING" to EVENT_PROCESSING,
        "EVENT_SUCCESS" to EVENT_SUCCESS,
        "EVENT_FAILURE" to EVENT_FAILURE,
        "EVENT_CANCELLED" to EVENT_CANCELLED,
        "EVENT_ERROR" to EVENT_ERROR)

    override fun getName(): String = "IProovReactNative"

    @ReactMethod
    fun launch(baseUrl: String, token: String, optionsString: String) {
        listener = IProovReactNativeListener(reactContext)
        IProov.registerListener(listener)

        val options = try {
            OptionsBridge.fromJson(reactContext, JSONObject(optionsString))
        } catch(e: IProovException) {
            e.printStackTrace()
            listener.onError(e)
            return
        } catch (e: JSONException) {
            e.printStackTrace()
            listener.onError(InvalidOptionsException(reactContext, e.localizedMessage));
            return
        }

        try {
            IProov.launch(reactContext, baseUrl, token, options)
        } catch(e: IProovException) {
            e.printStackTrace()
            listener.onError(e)
        }
    }

    // Required for RN 0.65+, otherwise you get a warning
    // More info here: https://github.com/facebook/react-native/commit/114be1d2170bae2d29da749c07b45acf931e51e2
    @ReactMethod
    fun addListener(eventName: String) {
        // Do nothing
    }

    // TODO Should type be nullable considering java implementations uses Integer type not int
    @ReactMethod
    fun removeListeners(count: Int?) {
        // Do nothing
    }
    
}