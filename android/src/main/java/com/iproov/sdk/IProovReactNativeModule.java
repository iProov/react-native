// IProovReactNativeModule.java

package com.iproov.sdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.iproov.sdk.bridge.OptionsBridge;
import com.iproov.sdk.core.exception.IProovException;
import com.iproov.sdk.core.exception.InvalidOptionsException;

import java.util.HashMap;
import java.util.Map;

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
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("CONNECTING_EVENT", "iproov_connecting");
        constants.put("CONNECTED_EVENT", "iproov_connected");
        constants.put("PROCESSING_EVENT", "iproov_processing");
        constants.put("SUCCESS_EVENT", "iproov_success");
        constants.put("FAILURE_EVENT", "iproov_failure");
        constants.put("CANCELLED_EVENT", "iproov_cancelled");
        constants.put("ERROR_EVENT", "iproov_error");
        return constants;
    }

    @Override
    public String getName() {
        return "IProovReactNative";
    }

    @ReactMethod
    public void launch(String baseUrl, String token, String optionsString) {
        listener = new IProovReactNativeListener(reactContext);
        IProov.registerListener(listener);

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
            e.printStackTrace();
            listener.onError(e);
        }
    }

}
