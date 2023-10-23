package com.iproov.sdk

import android.graphics.Bitmap
import android.util.Base64
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.iproov.sdk.core.exception.*
import java.io.ByteArrayOutputStream

class IProovReactNativeListener(private val reactContext: ReactContext) : IProovCallbackLauncher.Listener {

    override fun onConnecting() { emitEvent(EVENT_CONNECTING) }

    override fun onConnected() { emitEvent(EVENT_CONNECTED) }

    override fun onProcessing(progress: Double, message: String?) {
        val params = Arguments.createMap().apply {
            putDouble("progress", progress)
            putString("message", message)
        }

        emitEvent(EVENT_PROCESSING, params)
    }

    override fun onSuccess(result: IProov.SuccessResult) {
        val params = Arguments.createMap()

        result.frame?.let {
            params.putString("frame", base64EncodeBitmap(it))
        }

        emitEvent(EVENT_SUCCESS, params)
    }

    override fun onFailure(result: IProov.FailureResult) {
        val params = Arguments.createMap().apply {
            putString("feedbackCode", result.reason.feedbackCode)
            putString("reason", reactContext.getString(result.reason.description))
        }

        result.frame?.let {
            params.putString("frame", base64EncodeBitmap(it))
        }

        emitEvent(EVENT_FAILURE, params)
    }

    override fun onCanceled(canceler: IProov.Canceler) {

        val params = Arguments.createMap().apply {
            putString("canceler", canceler.name)
        }

        emitEvent(EVENT_CANCELED, params)
    }

    override fun onError(exception: IProovException) {
        exception.printStackTrace()
        val params = Arguments.createMap().apply {
            putString("error", toErrorString(exception))
            putString("reason", exception.reason)
            putString("message", exception.localizedMessage)
        }

        emitEvent(EVENT_ERROR, params)
    }

    private fun toErrorString(e: IProovException): String =
        when(e) {
            is CaptureAlreadyActiveException -> "capture_already_active_error"
            is NetworkException -> "network_error"
            is CameraPermissionException -> "camera_permission_error"
            is ServerException -> "server_error"
            is MultiWindowUnsupportedException -> "multi_window_unsupported_error"
            is CameraException -> "camera_error"
            is FaceDetectorException -> "face_detector_error"
            is InvalidOptionsException -> "invalid_options_error"
            is UnsupportedDeviceException -> "unsupported_device_error"
            else -> "unexpected_error"
        }

    private fun base64EncodeBitmap(bitmap: Bitmap): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.NO_WRAP)
    }

    private fun emitEvent(name: String, params: WritableMap? = null) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(name, params)
    }    
}