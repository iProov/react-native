package com.iproov.sdk

import android.graphics.Bitmap
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.iproov.sdk.core.exception.*
import java.io.ByteArrayOutputStream

class IProovReactNativeListener(reactContext: ReactContext) : IProov.Listener {

    private val eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)

    override fun onConnecting() = eventEmitter.emit(EVENT_CONNECTING, null)

    override fun onConnected() = eventEmitter.emit(EVENT_CONNECTED, null)

    override fun onProcessing(progress: Double, message: String) {
        val params = Arguments.createMap().apply {
            putDouble("progress", progress)
            putString("message", message)
        }

        eventEmitter.emit(EVENT_PROCESSING, params)
    }

    override fun onSuccess(successResult: IProov.SuccessResult) {
        val params = Arguments.createMap()
        params.putString("token", successResult.token)
        
        successResult.frame?.let {
            params.putString("frame", base64EncodeBitmap(it))
        }

        eventEmitter.emit(EVENT_SUCCESS, params)
        IProov.unregisterListener(this)
    }

    override fun onFailure(failureResult: IProov.FailureResult) {
        val params = Arguments.createMap().apply {
            putString("token", failureResult.token)
            putString("feedbackCode", failureResult.feedbackCode)
            putString("reason", failureResult.reason)
        }

        failureResult.frame?.let {
            params.putString("frame", base64EncodeBitmap(it))
        }

        eventEmitter.emit(EVENT_FAILURE, params)
        IProov.unregisterListener(this)
    }

    override fun onCancelled() {
        eventEmitter.emit(EVENT_CANCELLED, null)
        IProov.unregisterListener(this)
    }

    override fun onError(e: IProovException) {
        e.printStackTrace()
        val params = Arguments.createMap().apply {
            putString("error", toErrorString(e))
            putString("reason", e.reason)
            putString("message", e.localizedMessage)
        }

        eventEmitter.emit(EVENT_ERROR, params)
        IProov.unregisterListener(this)
    }

    private fun toErrorString(e: IProovException): String =
        when(e) {
            is CaptureAlreadyActiveException -> "capture_already_active_error"
            is NetworkException -> "network_error"
            is CameraPermissionException -> "camera_permission_error"
            is ServerException -> "server_error"
            is ListenerNotRegisteredException -> "listener_not_registered_error"
            is MultiWindowUnsupportedException -> "multi_window_unsupported_error"
            is CameraException -> "camera_error"
            is FaceDetectorException -> "face_detector_error"
            is InvalidOptionsException -> "invalid_options_error"
            else -> "unexpected_error"
        }

    private fun base64EncodeBitmap(bitmap: Bitmap): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.NO_WRAP)
    }
}