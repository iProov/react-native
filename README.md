![iProov: Flexible authentication for identity assurance](https://github.com/iProov/react-native/raw/main/images/banner.jpg)
# iProov Biometrics React Native SDK (Preview)

## Table of contents

- [Introduction](#introduction)
- [Repository contents](#repository-contents)
- [Registration](#registration)
- [Installation](#installation)
- [Get started](#get-started)
- [Options](#options)
- [Handling errors](#handling-errors)
- [API Client](#api-client)
- [Sample code](#sample-code)
- [Help & support](#help--support)

## Introduction
The iProov Biometrics React Native SDK wraps iProov's native iOS (Swift) and Android (Java) SDKs behind a JavaScript interface for use from within your React Native iOS or Android app.

> ⚠️ **IMPORTANT:** The iProov Biometrics React Native SDK is currently in preview, which means that there may be missing/broken functionality, and the API is still subject to change. Please contact us to provide your feedback regarding the iProov Biometrics React Native SDK Preview.

### Requirements

- React Native 0.60 and above
- iOS 10 and above
- Android API Level 21 (Android 5 Lollipop) and above

## Repository contents
- **src** - contains the React Native bindings for the SDK
- **android** - contains the Android-specific bindings
- **ios** - contains the iOS-specific bindings
- **example** - a basic React Native example app

## Registration

You can obtain API credentials by registering on the [iProov Partner Portal](https://portal.iproov.net).

## Installation

1. Add the following to your package.json file:
	
	```json
	"dependencies": {
	  "iproov-react-native": "git+ssh://git@github.com:iProov/react-native.git#0.1.0"
	}
	```

2. From your React Native app directory, run:
	
	```sh
	yarn
	```

### iOS installation

1. Add an `NSCameraUsageDescription` entry to your app's Info.plist, with the reason why your app requires camera access (e.g. “To iProov you in order to verify your identity.”)

2. You need to make various modifications to your Podfile to support iProov:

	1. **Enable frameworks** - Cocoapods by default builds static libraries rather than frameworks. You should add the following to your Podfile:
	
		```ruby
		use_frameworks!
		```
		
		Please note that [Flipper](https://fbflipper.com/docs/getting-started/react-native/) does not work with `use_frameworks`, so you should remove `use_flipper()` if you have it enabled.
	
	2. **Ensure React Native builds static frameworks, except for iProov** - Since `use_frameworks!` will now build everything as frameworks, you now need to explicitly set everything to build as static frameworks except for iProov and its dependencies which are dynamic, so you must add this `pre_install` step (or add it to your existing `pre_install` step if you have one already):
		
		```ruby
		pre_install do |installer|
		  installer.pod_targets.each do |pod|
		    if !['iProov', 'Socket.IO-Client-Swift', 'Starscream'].include?(pod.name)
		      def pod.static_framework?;
		        true
		      end
		      def pod.build_type;
		        Pod::BuildType.static_library
		      end
		    end
		  end
		end
		```
		
	3. **Enable module stability** - iProov and its dependencies require `BUILD_LIBRARY_FOR_DISTRIBUTION` to be enabled. Add the following `post_install` step (or add it to your existing `post_install` step if you have one already):
	
		```ruby
		post_install do |installer|
		  installer.pods_project.targets.each do |target|
		    if ['iProov', 'Socket.IO-Client-Swift', 'Starscream'].include? target.name
		      target.build_configurations.each do |config|
		        config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
		      end
		    end
		  end
		end
		```

2. In your React Native app `ios` directory, run:

	```sh
	pod install
	```	
		
	This will install all Pods and apply the above workarounds.
	
### Android installation

You must add the iProov repository URL to your `repositories` block inside the `allprojects` block in your build.gradle file:

```groovy
allprojects {
    repositories {
        maven { url 'https://raw.githubusercontent.com/iProov/android/master/maven/' } // Add this
    }
}
```

## Get started

Once you have a valid token (obtained via the React Native API client or your own backend-to-backend call), you can `launch()` an iProov capture and handle the callback events as follows:

```javascript
import IProov from 'iproov-react-native'

let options = new IProov.Options()
options.ui.filter = IProov.Options.VIBRANT

IProov.launch('https://eu.rp.secure.iproov.me/api/v2', "< YOUR TOKEN >", options, (event) => {
  switch(event.event) {
	
  case IProov.CONNECTING_EVENT:
    // The SDK is connecting to the server. You should provide an indeterminate progress indicator
    // to let the user know that the connection is taking place.
    break
	
  case IProov.CONNECTED_EVENT:
    // The SDK has connected, and the iProov user interface will now be displayed. You should hide
    // any progress indication at this point.
      break
	
case IProov.PROCESSING_EVENT:
    // The SDK will update your app with the progress of streaming to the server and authenticating
    // the user. This will be called multiple time as the progress updates.
  
    let progress = event.params.progress
    let message = event.params.message
    break
	
  case IProov.CANCELLED_EVENT:
    // The user cancelled iProov, either by pressing the close button at the top right, or sending
    // the app to the background.
    break
	
  case IProov.FAILURE_EVENT:
    // The user was not successfully verified/enrolled, as their identity could not be verified,
    // or there was another issue with their verification/enrollment. A reason (as a string)
    // is provided as to why the claim failed, along with a feedback code from the back-end.
  
    let token = event.params.token
    let frame = event.params.frame // Optional property containing a single Base64 encoded frame
    break
	
  case IProov.SUCCESS_EVENT:
    // The user was not successfully verified/enrolled due to an error (e.g. lost internet connection).
    // You will be provided with an Exception (see below).
    // It will be called once, or never.
  
    let token = event.params.token
    let feedbackCode = event.params.feedback_code
    let reason = event.params.reason
    let frame = event.params.frame // Optional property containing a single Base64 encoded frame
    break
    
  case IProov.ERROR_EVENT:
    // The user was not successfully verified/enrolled due to an error (e.g. lost internet connection).
    // You will be provided with an Exception (see below).
    // It will be called once, or never.
    let error = event.params.error
    let reason = event.params.reason
    let message = event.params.message
    break
  }
})
```

👉 You should now familiarise yourself with the following resources:

-  [iProov Biometrics iOS SDK documentation](https://github.com/iProov/ios)
-  [Android Biometrics Android SDK documentation](https://github.com/iProov/android)

These repositories provide comprehensive documentation about the available customization options and other important details regarding the SDK usage.

## Options

The `Options` class allows iProov to be customized in various ways. These can be specified by passing options in `IProov.launch()`.

Most of these options are common to both Android and iOS, however, some are platform-specific (for example, iOS has a close button but Android does not).

For full documentation, please read the respective [iOS](https://github.com/iProov/ios#options) and [Android](https://github.com/iProov/android#options) native SDK documentation.

A summary of the support for the various SDK options in React Native is provided below. All options can be null and any options not set will default to their platform-specific default value.

| Option                                          | Type               | iOS   | Android |
|-------------------------------------------------|--------------------------------|-------|---------|
| **`Options.ui.`**                               |                    |       |         |
| `filter`                                        | `Options.(SHADED\|VIBRANT\|CLASSIC)` | ✅     | ✅       |
| `lineColor`                                    | `String` (#argb)          | ✅     | ✅       |
| `backgroundColor`                              | `String` (#argb)  | ✅     | ✅       |
| `headerBackgroundColor`                       | `String` (#argb)        | ✅     | ✅       |
| `footerBackgroundColor`                       | `String` (#argb)         | ✅     | ✅       |
| `headerTextColor`                             | `String` (#argb)          | ✅     | ✅       |
| `footerTextColor`                             | `String` (#argb)          | ✅     | ✅       |
| `promptTextColor`                             | `String` (#argb)           | ✅     | ✅       |
| `floatingPromptEnabled`                       | `Boolean`            | ✅     | ✅       |
| `title`                                         | `String`          | ✅     | ✅       |
| `fontPath`                                     | Unsupported         | ❌ (1) | ❌(1)   |
| `logoImage`                                    | `String` (Base64-encoded image)           | ✅     | ✅       |
| `closeButtonImage`                              | `String` (Base64-encoded image)          | ✅     |         |
| `closeButtonTintColor`                          | `String` (#argb)           | ✅     |         |
| `enableScreenshots`                            | `Boolean`            |       | ✅       |
| `orientation`                                   | `Options.(PORTRAIT\|LANDSCAPE\|REVERSE_PORTRAIT\|REVERSE_LANDSCAPE)`|       | ✅       |
| `activityCompatibilityRequestCode`           | `Number` (int)            |       | ✅       |
| **`Options.ui.genuinePresenceAssurance.`**      |                    |       |         |
| `autoStartDisabled`                           | `Boolean`            | ✅     | ✅       |
| `notReadyTintColor`                          | `String` (#argb)       | ✅     | ✅       |
| `readyTintColor`                              | `String` (#argb)       | ✅     | ✅       |
| `progressBarColor`                            | `String` (#argb)           | ✅     | ✅       |
| **`Options.ui.livenessAssurance.`**             |                    |       |         |
| `primaryTintColor`                            | `String` (#argb)         | ✅     | ✅       |
| `secondaryTintColor`                          | `String` (#argb)          | ✅     | ✅       |
| **`Options.network.`**                          |                    |       |         |
| `certificates`                                  | `String[]` (base 64 encoded string in DER format) | ✅     | ✅       |
| `timeout`                                       | `Number` (int)       | ✅     | ✅       |
| `path`                                          | `String`          | ✅     | ✅       |
| **`Options.capture.`**                          |                    |       |         |
| `camera`                                        | `Options.(FRONT\|EXTERNAL)`          |       | ✅       |
| `faceDetector`                                  | `Options.(AUTO\|CLASSIC\|ML_KIT\|BLAZEFACE)`    |       | ✅       |
| **`Options.capture.genuinePresenceAssurance.`** |                    |       |         |
| `maxPitch`                                     | `Number`          | ✅ (2) | ✅ (2)   |
| `maxYaw`                                       | `Number`          | ✅ (2) | ✅ (2)   |
| `maxRoll`                                      | `Number`          | ✅ (2) | ✅ (2)   |

(1) Custom fonts are not currently supported and will be added in a future version of the React Native SDK.

(2) This is an advanced option and not recommended for general usage. If you wish to use this option, contact iProov for for further details.

## Handling errors

IProov listener error events will contain an `error` string within the events `params` property which maps to native exceptions:

| Exception                         | iOS | Android | Description                                                                                                                      |
| --------------------------------- | --- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `capture_already_active_error`   | ✅   | ✅       | An existing iProov capture is already in progress. Wait until the current capture completes before starting a new one.           |
| `network_error`                    | ✅   | ✅       | An error occurred with the video streaming process. Consult the `message` value for more information.                            |
| `camera_permission_error`           | ✅   | ✅       | The user disallowed access to the camera when prompted. You should direct the user to re-enable camera access.                   |
| `server_error`                 | ✅   | ✅       | A server-side error/token invalidation occurred. The associated `message` will contain further information about the error.      |
| `unexpected_error`        | ✅   | ✅       | An unexpected and unrecoverable error has occurred. These errors should be reported to iProov for further investigation.         |
| `listener_not_registered_error`  |     | ✅       | The SDK was launched before a listener was registered.                                                                           |
| `multi_window_unsupported_error` |     | ✅       | The user attempted to iProov in split-screen/multi-screen mode, which is not supported.                                          |
| `camera_error`                 |     | ✅       | An error occurred acquiring or using the camera. This could happen when a non-phone is used with/without an external/USB camera. |
| `face_detector_error`           |     | ✅       | An error occurred with the face detector.                                                                                        |
| `invalid_options_error`         |     | ✅       | An error occurred when trying to apply your options.                                                                             |


## API Client

The React Native API Client provides a convenient wrapper to call iProov's REST API v2 from a React Native app. It is a useful tool to assist with testing, debugging and demos, but should not be used in production mobile apps.

The React Native API client can be found in `ApiClient.js` in the example project.

To setup your credentials, copy `credentials.example.js` to `credentials.js` and add them to the example project.

> ⚠️ **SECURITY NOTICE:** Use of the React Native API Client requires providing it with your API secret. **You should never embed your API secret within a production app.**

### Functionality

The React Native API Client supports the following functionality:

- `getToken()` - Get an enrol/verify token
- `enrolPhoto()` - Perform a photo enrolment (either from an electronic or optical image). The image must be provided as an [`Image`](https://pub.dev/packages/image).
- `enrolPhotoAndGetVerifyToken()` - A convenience method which first gets an enrolment token, then enrols the photo against that token, and then gets a verify token for the user to iProov against.
- `validate()` - Validates a token, this is typically called via a backend-to-backend call to ensure that the claim was successful.
- `invalidate()` - Used to cancel (invalidate) a token. Once a token has been invalidated, it can no longer be used.

### Getting a token

The most useful thing you can do with the API Client is get a token to either enrol or verify a user, using either iProov's Genuine Presence Assurance or Liveness Assurance.

This is achieved as follows:

```javascript
import ApiClient, { CLAIM_TYPE_ENROL, ASSURANCE_TYPE_LIVENESS } from './ApiClient.js'

let apiClient = ApiClient({
  baseUrl: "https://eu.rp.secure.iproov.me/api/v2/", // Substitute URL as appropriate
  apiKey: "< YOUR API KEY >",
  secret: "< YOUR SECRET >"
});

let token = await apiClient.getToken(ASSURANCE_TYPE_LIVENESS, CLAIM_TYPE_ENROL, "name@example.com");
```

You can then launch the iProov SDK with this token.

## Sample code

For a simple iProov experience that is ready to run out-of-the-box, check out the React Native example project which also makes use of the React Native API Client.

In the example app folder, copy the `credentials.example.js` file to `credentials.js` and add your credentials obtained from the [iProov portal](https://portal.iproov.com/).

Once You have complete the [installation](#installation) instructions, to run the example app, you should run the following commands from the example project directory:

```sh
npx react-native run-android		# Run on Android
npx react-native run-ios --device	# Run on iOS
```

> NOTE: iProov is not supported on the iOS or Android simulator, you must use a physical device in order to iProov.

## Help & support

You may find your question is answered in the documentation of our native SDKs:

- iOS - [Documentation](https://github.com/iProov/ios), [FAQs](https://github.com/iProov/ios/wiki/Frequently-Asked-Questions)
- Android - [Documentation](https://github.com/iProov/android), [FAQs](https://github.com/iProov/android/wiki/Frequently-Asked-Questions)

For further help with integrating the SDK, please contact [support@iproov.com](mailto:support@iproov.com).
