// IProovReactNativeModule.java

package com.iproov.sdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.iproov.sdk.bridge.OptionsBridge;
import com.iproov.sdk.core.exception.IProovException;
import com.iproov.sdk.core.exception.InvalidOptionsException;

import org.json.JSONException;
import org.json.JSONObject;

public class IProovReactNativeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private IProovReactNativeListener listener;

    public IProovReactNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public void initialize() {
        super.initialize();
        // We can only obtain the emitter instance once initialize has been called
        listener = new IProovReactNativeListener(reactContext);
        IProov.registerListener(listener);
    }

    @Override
    public String getName() {
        return "IProovReactNative";
    }

    @ReactMethod
    public void launch(String baseUrl, String token, String optionsString) {

        IProov.Options options;

        try {
            options = OptionsBridge.fromJson(reactContext, new JSONObject(optionsString));
        } catch (IProovException e) {
          e.printStackTrace();
          listener.onError(e);
          return;
        } catch (JSONException e) {
          e.printStackTrace();
          listener.onError(new InvalidOptionsException(reactContext, e.getLocalizedMessage()));
          return;
        }

        try {
            IProov.launch(reactContext, baseUrl, token, options);
        } catch (IProovException e) {
            // TODO propagate error to event emitter
            e.printStackTrace();
            listener.onError(e);
        }
    }

    @ReactMethod
    public void launch(String baseUrl, String token) {

        try {
            IProov.launch(reactContext, baseUrl, token);
        } catch (IProovException e) {
            // TODO propagate error to event emitter
            e.printStackTrace();
            listener.onError(e);
        }
    }

}
