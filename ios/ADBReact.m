//
//  ADBReact.m
//  TomTomADBMobile
//
//  Created by Patrick Burggraaf on 12/06/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ADBReact.h"
#import <React/RCTLog.h>
#import "ADBMobile.h"
#import "keyChain.h"

static NSString * const KeychainItem_Service = @"FDKeychain";
static NSString * const KeychainItem_UUID = @"Local";

@implementation ADBReact

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(collectLifeCycleData)
{
  [ADBMobile collectLifecycleData];
}
RCT_EXPORT_METHOD(trackAction:(NSString *)page contextData:(NSDictionary *)contextData)
{
  NSLog(@"Calling Track Action %@", contextData);
  ADBMobile.debugLogging = true;
  [ADBMobile trackAction:page data:contextData];
}

RCT_EXPORT_METHOD(trackState:(NSString *)page contextData:(NSDictionary *)contextData)
{
  NSLog(@"Calling Track State %@", page);
  [ADBMobile trackState:page data:contextData];
  
}

RCT_EXPORT_METHOD(getIdentfier:(RCTResponseSenderBlock)callback)
{
  NSString* someString = @"abc12345";
  callback(@[someString]);
}

RCT_EXPORT_METHOD(getUUID:(RCTResponseSenderBlock)callback)
{
  //NSUUID *deviceId =  [UIDevice currentDevice].identifierForVendor;
  NSString *UUID = [self generateUUID];
  
  //RCTLogInfo(@"Pretending to create an event");
  //callback(@[[NSNull null], [NSArray arrayWithObjects: [deviceId UUIDString], nil]]);
  callback(@[[NSNull null], [NSArray arrayWithObjects: @[UUID], nil]]);
  //RCTLogInfo(UUID);
  //callback(@[UUID]);
}

-(NSString *)generateUUID {
  NSString *CFUUID = nil;
  
  if (![FDKeychain itemForKey: KeychainItem_UUID
                   forService: KeychainItem_Service
                        error: nil]) {
    //create CFUUDID.
    CFUUIDRef uuid = CFUUIDCreate(kCFAllocatorDefault);
    
    CFUUID = (NSString *)CFBridgingRelease(CFUUIDCreateString(kCFAllocatorDefault, uuid));
    
    //[[NSUserDefaults standardUserDefaults] setObject:CFUUID forKey:@"UUID"];
    
    [FDKeychain saveItem: CFUUID
                  forKey: KeychainItem_UUID
              forService: KeychainItem_Service
                   error: nil];
    
  } else {
    // CFUUID = [[NSUserDefaults standardUserDefaults] objectForKey:@"UUID"];
    CFUUID = [FDKeychain itemForKey: KeychainItem_UUID
                         forService: KeychainItem_Service
                              error: nil];
  }
  
  return CFUUID;
}

@end
