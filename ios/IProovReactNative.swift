import Foundation
import iProov

private enum EventName: String, CaseIterable {
    case connecting,
         connected,
         processing,
         success,
         failure,
         cancelled,
         error

    var rawValue: String {
        switch self {
        case .connecting:
            return "iproov_connecting"
        case .connected:
            return "iproov_connected"
        case .processing:
            return "iproov_processing"
        case .success:
            return "iproov_success"
        case .failure:
            return "iproov_failure"
        case .cancelled:
            return "iproov_cancelled"
        case .error:
            return "iproov_error"
        }
    }
}

@objc(IProovReactNative)
class IProovReactNative: RCTEventEmitter {

    override class func requiresMainQueueSetup() -> Bool {
        true
    }

    override func supportedEvents() -> [String]! {
        EventName.allCases.map(\.rawValue)
    }

    @objc
    override func constantsToExport() -> [AnyHashable : Any]! {
        [
            "EVENT_CONNECTING": EventName.connecting.rawValue,
            "EVENT_CONNECTED": EventName.connected.rawValue,
            "EVENT_PROCESSING": EventName.processing.rawValue,
            "EVENT_SUCCESS": EventName.success.rawValue,
            "EVENT_FAILURE": EventName.failure.rawValue,
            "EVENT_CANCELLED": EventName.cancelled.rawValue,
            "EVENT_ERROR": EventName.error.rawValue
        ]
  }

    @objc(launch:token:optionsJSON:)
    func launch(streamingURL: String, token: String, optionsJSON: String) {
        guard let json = try? JSONSerialization.jsonObject(with: optionsJSON.data(using: .utf8)!, options: []) as? [String: Any] else {
            self.sendEvent(withName: EventName.error.rawValue, body: [
                "error": "unexpected_error",
                "reason": nil,
                "message": "Invalid JSON passed from React Native"
            ])
            return
        }

        let options = Options.from(json: json)

        IProov.launch(streamingURL: streamingURL, token: token, options: options) { status in

            switch status {
            case .connecting:
                self.sendEvent(withName: EventName.connecting.rawValue, body: nil)
            case .connected:
                self.sendEvent(withName: EventName.connected.rawValue, body: nil)
            case let .processing(progress, message):
                self.sendEvent(withName: EventName.processing.rawValue, body: [
                    "progress": progress,
                    "message": message
                ])
            case let .success(result):
                self.sendEvent(withName: EventName.success.rawValue, body: [
                    "token": result.token,
                    "frame": result.frame?.pngData()?.base64EncodedString()
                ])
            case let .failure(result):
                self.sendEvent(withName: EventName.failure.rawValue, body: [
                    "token": token,
                    "reason": result.reason,
                    "feedbackCode": result.feedbackCode,
                    "frame": result.frame?.pngData()?.base64EncodedString()
                ])
            case .cancelled:
                self.sendEvent(withName: EventName.cancelled.rawValue, body: nil)
            case let .error(error):
                self.sendEvent(withName: EventName.error.rawValue, body: [
                    "error": error.errorName,
                    "reason": error.failureReason,
                    "message": error.localizedMessage
                ])
            @unknown default:
                break
            }
        }
    }

}


private extension IProovError {

    var errorName: String {
        switch self {
        case .captureAlreadyActive:
            return "capture_already_active_error"
        case .networkError:
            return "network_error"
        case .cameraPermissionDenied:
            return "camera_permission_error"
        case .serverError:
            return "server_error"
        case .unexpectedError:
            fallthrough
        @unknown default:
            return "unexpected_error"
        }
    }

}

