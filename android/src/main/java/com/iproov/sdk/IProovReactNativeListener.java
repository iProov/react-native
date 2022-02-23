package com.iproov.sdk;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.iproov.sdk.core.exception.IProovException;

public class IProovReactNativeListener implements IProov.Listener {

    private final DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;

    public IProovReactNativeListener(ReactContext reactContext) {
        eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }
    @Override
    public void onConnecting() {
        eventEmitter.emit("iproov_connecting", null);
    }

    @Override
    public void onConnected() {
        eventEmitter.emit("iproov_connected", null);
    }

    @Override
    public void onProcessing(double progress, String message) {
        WritableMap params = Arguments.createMap();
        params.putDouble("progress", progress);
        params.putString("message", message);

        eventEmitter.emit("iproov_processing", params);
    }

    @Override
    public void onSuccess(@NonNull IProov.SuccessResult successResult) {
        WritableMap params = Arguments.createMap();
        params.putString("token", successResult.token);
        // TODO what about frame

        eventEmitter.emit("iproov_success", params);
    }

    @Override
    public void onFailure(@NonNull IProov.FailureResult failureResult) {
        WritableMap params = Arguments.createMap();
        params.putString("token", failureResult.token);
        params.putString("feedback_code", failureResult.feedbackCode);
        params.putString("reason", failureResult.reason);
        // TODO what about frame

        eventEmitter.emit("iproov_failure", params);
    }

    @Override
    public void onCancelled() {
        eventEmitter.emit("iproov_cancelled", null);
    }

    @Override
    public void onError(@NonNull IProovException e) {
        e.printStackTrace();
        WritableMap params = Arguments.createMap();
        params.putString("reason", e.getReason());
        params.putString("message", e.getLocalizedMessage());

        eventEmitter.emit("iproov_error", params);
    }
}
