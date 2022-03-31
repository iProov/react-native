#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(IProovReactNative, RCTEventEmitter)

RCT_EXTERN_METHOD(launch:(NSString *)streamingURL token:(NSString *)token optionsJSON:(NSString *)optionsJSON)

@end
