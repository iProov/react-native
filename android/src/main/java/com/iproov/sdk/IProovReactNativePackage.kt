package com.iproov.sdk

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class IProovReactNativePackage: ReactPackage {
    
    override fun createNativeModules(reactContext: ReactApplicationContext) 
        = listOf<NativeModule>(IProovReactNativeModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext) = listOf<ViewManager<*,*>>()
}