//
//  IProov.swift
//  iproov-react-native
//
//  Created by Jonathan Ellis on 03/03/2022.
//

import Foundation
import iProov

@objc(IProovReactNative)
class IProovReactNative: RCTEventEmitter {

    override class func requiresMainQueueSetup() -> Bool {
        true
    }

    override func supportedEvents() -> [String]! {
        [  // TODO: Naming convention
            "iproov_connecting",
            "iproov_connected",
            "iproov_processing",
            "iproov_success",
            "iproov_failure",
            "iproov_error",
            "iproov_cancelled"
        ]
    }

    @objc
    override func constantsToExport() -> [AnyHashable : Any]! {
        [
            "EVENT_CONNECTING": "iproov_connecting",
            "EVENT_CONNECTED": "iproov_connected",
            "EVENT_PROCESSING": "iproov_processing",
            "EVENT_SUCCESS": "iproov_success",
            "EVENT_FAILURE": "iproov_failure",
            "EVENT_CANCELLED": "iproov_cancelled",
            "EVENT_ERROR": "iproov_error"
        ]
  }

    @objc(launch:token:optionsJSON:)
    func launch(streamingURL: String, token: String, optionsJSON: String) {
        let json = try! JSONSerialization.jsonObject(with: optionsJSON.data(using: .utf8)!, options: []) as! [String: Any] // TODO: Error handling here
        let options = Options.from(json: json)

        IProov.launch(streamingURL: streamingURL, token: token, options: options) { status in
            switch status {
            case .connecting:
                self.sendEvent(withName: "iproov_connecting", body: nil)
            case .connected:
                self.sendEvent(withName: "iproov_connected", body: nil)
            case let .processing(progress, message):
                self.sendEvent(withName: "iproov_processing", body: [
                    "progress": progress,
                    "message": message
                ])
            case let .success(result):
                self.sendEvent(withName: "iproov_success", body: [
                    "token": result.token
                ])
            case let .failure(result):
                self.sendEvent(withName: "iproov_failure", body: [
                    "token": token,
                    "reason": result.reason,
                    "feedback_code": result.feedbackCode
                ])
            case .cancelled:
                self.sendEvent(withName: "iproov_cancelled", body: nil)
            case let .error(error):
                self.sendEvent(withName: "iproov_error", body: [
                    "reason": error.failureReason,
                    "message": error.localizedMessage
                ])
            @unknown default:
                break
            }
        }
    }

}
