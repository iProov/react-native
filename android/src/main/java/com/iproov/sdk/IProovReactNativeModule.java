// IProovReactNativeModule.java

package com.iproov.sdk;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.iproov.androidapiclient.javaretrofit.ApiClientJavaRetrofit;
import com.iproov.androidapiclient.javaretrofit.ClaimType;
import com.iproov.androidapiclient.javaretrofit.Token;
import com.iproov.sdk.core.exception.IProovException;

import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Response;

public class IProovReactNativeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private ApiClientJavaRetrofit apiClient;
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
    public void launch() {
        Log.d("REACT_NATIVE", "iProov SDK Launched");
        launch(null, null, "verify", "laolu.animashaun@iproov.com");
    }

    public void launch(final String token, final String baseUrl, String claimTypeStr, String userId) {

        ClaimType claimType = ClaimType.VERIFY;

        if (claimTypeStr.equals("enrol")) claimType = ClaimType.ENROL;

        getApiClient().getToken(ApiClientJavaRetrofit.AssuranceType.GENUINE_PRESENCE, claimType, userId, tokenCallback, null);
    }

    @ReactMethod
    public void launchIProovSafely(String token, String baseUrl) {

        IProov.Options options = new IProov.Options();
        options.ui.enableScreenshots = true;

        Log.d("ReactNative", "Token generated");
        try {
            IProov.launch(reactContext, baseUrl, token, options);
        } catch (IProovException e) {
            // TODO propagate error to event emitter
            Log.d("ReactNative", e.getMessage());
            e.printStackTrace();
        }
    }

    public ApiClientJavaRetrofit getApiClient() {
        if (apiClient == null) {
            apiClient = new ApiClientJavaRetrofit(reactContext, BASE_URL, HttpLoggingInterceptor.Level.BODY, API_KEY, SECRET);
        }

        return apiClient;
    }

    private retrofit2.Callback<Token> tokenCallback = new retrofit2.Callback<Token>() {
        @Override
        public void onResponse(Call<Token> call, Response<Token> response) {
            Log.d("ReactNative", "Token " + response.body().getToken());
            launchIProovSafely(response.body().getToken(), BASE_URL);
        }

        @Override
        public void onFailure(Call<Token> call, Throwable throwable) {
            Log.d("ReactNative", "Token generation failed");
            throwable.printStackTrace();
        }
    };

}
