package com.iproov.sdk

import com.facebook.react.bridge.LifecycleEventListener
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
const val EVENT_CANCELED = "iproov_canceled"
const val EVENT_ERROR = "iproov_error"

class IProovReactNativeModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var iProovCallbackListener: IProovReactNativeListener? = null
    private var iProov: IProovCallbackLauncher? = null 
    private var iProovSession: IProov.Session? = null

    private var lifecycleEventListener: LifecycleEventListener = object : LifecycleEventListener {
        override fun onHostResume() {}

        override fun onHostPause() {}

        override fun onHostDestroy() {
            iProovSession = null
            iProov?.listener = null
            iProov = null
            iProovCallbackListener = null
        }
    }

    override fun getConstants(): Map<String, Any> = mapOf(
        "EVENT_CONNECTING" to EVENT_CONNECTING,
        "EVENT_CONNECTED" to EVENT_CONNECTED, 
        "EVENT_PROCESSING" to EVENT_PROCESSING,
        "EVENT_SUCCESS" to EVENT_SUCCESS,
        "EVENT_FAILURE" to EVENT_FAILURE,
        "EVENT_CANCELED" to EVENT_CANCELED,
        "EVENT_ERROR" to EVENT_ERROR)

    override fun getName(): String = "IProovReactNative"

    fun setUpIProovInstances() {
        if( iProov == null)
            iProov = IProovCallbackLauncher()

        if( iProovCallbackListener == null) {
            iProovCallbackListener = IProovReactNativeListener(reactContext)
            iProov?.listener = iProovCallbackListener!!
        }
    }

    @ReactMethod
    fun cancel() {
        iProovSession?.cancel()
    }

    @ReactMethod
    fun launch(baseUrl: String, token: String, optionsString: String) {
        reactContext.addLifecycleEventListener(lifecycleEventListener)
        setUpIProovInstances()

        val options = try {
            OptionsBridge.fromJson(reactContext, JSONObject(optionsString))
        } catch(e: IProovException) {
            e.printStackTrace()
            iProovCallbackListener?.onError(e)
            return
        } catch (e: JSONException) {
            e.printStackTrace()
            iProovCallbackListener?.onError(InvalidOptionsException(reactContext, e.localizedMessage));
            return
        }

        try {
            iProovSession = iProov?.launch(reactContext, baseUrl, token, options)
        } catch(e: IProovException) {
            e.printStackTrace()
            iProovCallbackListener?.onError(e)
        }
    }




    // Required for RN 0.65+, otherwise you get a warning
    // More info here: https://github.com/facebook/react-native/commit/114be1d2170bae2d29da749c07b45acf931e51e2
    @ReactMethod
    fun addListener(eventName: String) {}

    // TODO Should type be nullable considering java implementations uses Integer type not int
    @ReactMethod
    fun removeListeners(count: Int?) {}

}