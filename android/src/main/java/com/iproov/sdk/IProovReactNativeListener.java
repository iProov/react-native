package com.iproov.sdk;

import androidx.annotation.NonNull;

import android.graphics.Bitmap;
import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.iproov.sdk.core.exception.IProovException;

import java.io.ByteArrayOutputStream;

public class IProovReactNativeListener implements IProov.Listener {

    private final DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;

    public IProovReactNativeListener(ReactContext reactContext) {
        eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    @Override
    public void onConnecting() {
        eventEmitter.emit(IProovReactNativeModule.CONNECTING_EVENT, null);
    }

    @Override
    public void onConnected() {
        eventEmitter.emit(IProovReactNativeModule.CONNECTED_EVENT, null);
    }

    @Override
    public void onProcessing(double progress, String message) {
        WritableMap params = Arguments.createMap();
        params.putDouble("progress", progress);
        params.putString("message", message);

        eventEmitter.emit(IProovReactNativeModule.PROCESSING_EVENT, params);
    }

    @Override
    public void onSuccess(@NonNull IProov.SuccessResult successResult) {
        WritableMap params = Arguments.createMap();
        params.putString("token", successResult.token);

        if(successResult.frame != null) {
            params.putString("frame", base64EncodeBitmap(successResult.frame));
        }

        eventEmitter.emit(IProovReactNativeModule.SUCCESS_EVENT, params);
        IProov.unregisterListener(this);
    }

    @Override
    public void onFailure(@NonNull IProov.FailureResult failureResult) {
        WritableMap params = Arguments.createMap();
        params.putString("token", failureResult.token);
        params.putString("feedback_code", failureResult.feedbackCode);
        params.putString("reason", failureResult.reason);
        if(failureResult.frame != null) {
            params.putString("frame", base64EncodeBitmap(failureResult.frame));
        }

        eventEmitter.emit(IProovReactNativeModule.FAILURE_EVENT, params);
        IProov.unregisterListener(this);
    }

    @Override
    public void onCancelled() {
        eventEmitter.emit(IProovReactNativeModule.CANCELLED_EVENT, null);
        IProov.unregisterListener(this);
    }

    @Override
    public void onError(@NonNull IProovException e) {
        e.printStackTrace();
        WritableMap params = Arguments.createMap();
        params.putString("reason", e.getReason());
        params.putString("message", e.getLocalizedMessage());

        eventEmitter.emit(IProovReactNativeModule.ERROR_EVENT, params);
        IProov.unregisterListener(this);
    }

    private static String base64EncodeBitmap(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();  
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.NO_WRAP);
    }
}
