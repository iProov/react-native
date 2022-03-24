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
    
    public static final String CONNECTING_EVENT = "iproov_connecting";
    public static final String CONNECTED_EVENT = "iproov_connected";
    public static final String PROCESSING_EVENT = "iproov_processing";
    public static final String SUCCESS_EVENT = "iproov_success";
    public static final String FAILURE_EVENT = "iproov_failure";
    public static final String CANCELLED_EVENT = "iproov_cancelled";
    public static final String ERROR_EVENT = "iproov_error";


    public IProovReactNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("CONNECTING_EVENT", CONNECTING_EVENT);
        constants.put("CONNECTED_EVENT", CONNECTED_EVENT);
        constants.put("PROCESSING_EVENT", PROCESSING_EVENT);
        constants.put("SUCCESS_EVENT", SUCCESS_EVENT);
        constants.put("FAILURE_EVENT", FAILURE_EVENT);
        constants.put("CANCELLED_EVENT", CANCELLED_EVENT);
        constants.put("ERROR_EVENT", ERROR_EVENT);
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
