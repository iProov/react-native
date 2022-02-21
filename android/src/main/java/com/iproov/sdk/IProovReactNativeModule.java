// IProovReactNativeModule.java

package com.iproov.sdk;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.iproov.sdk.core.exception.IProovException;

public class IProovReactNativeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String API_KEY = "342a9ecc7a38610ab08620110c6250812d2a6c1d";
    private static final String SECRET = "cefd2abf7aa3be084e1e8892fbdd262eb1553d03";
    private static final String BASE_URL = "https://beta.rp.secure.iproov.me/api/v2/";
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
    public void launch(String token, String baseUrl) {

        IProov.Options options = new IProov.Options();
        options.ui.enableScreenshots = true;

        Log.d("ReactNative", "Token generated");
        try {
            IProov.launch(reactContext, baseUrl, token, options);
        } catch (IProovException e) {
            // TODO propagate error to event emitter
            e.printStackTrace();
        }
    }

}
