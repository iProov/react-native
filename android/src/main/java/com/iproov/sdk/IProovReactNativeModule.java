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
    
    public static final String EVENT_CONNECTING = "iproov_connecting";
    public static final String EVENT_CONNECTED = "iproov_connected";
    public static final String EVENT_PROCESSING = "iproov_processing";
    public static final String EVENT_SUCCESS = "iproov_success";
    public static final String EVENT_FAILURE = "iproov_failure";
    public static final String EVENT_CANCELLED = "iproov_cancelled";
    public static final String EVENT_ERROR = "iproov_error";


    public IProovReactNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("EVENT_CONNECTING", EVENT_CONNECTING);
        constants.put("EVENT_CONNECTED", EVENT_CONNECTED);
        constants.put("EVENT_PROCESSING", EVENT_PROCESSING);
        constants.put("EVENT_SUCCESS", EVENT_SUCCESS);
        constants.put("EVENT_FAILURE", EVENT_FAILURE);
        constants.put("EVENT_CANCELLED", EVENT_CANCELLED);
        constants.put("EVENT_ERROR", EVENT_ERROR);
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
