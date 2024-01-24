//
//  SessionManager.swift
//  SwiftSample
//
//  Created by Vikas Jayaram on 28/6/2022.
//
import Foundation
import SimpleKeychain
import Auth0
import UIKit
import JWTDecode

enum SessionManagerError: Error {
    case noAccessToken
}

class SessionManager {
    static let shared = SessionManager()
    //let keychain = A0SimpleKeychain(service: "Auth0")

    var profile: UserInfo?
    //lazy var credentialManager = CredentialsManager(authentication: Auth0.authentication())
    lazy var credentialManager: CredentialsManager? = {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 3.0
        config.timeoutIntervalForResource = 3.0
        let session = URLSession(configuration: config)

            return CredentialsManager(authentication:

                                        Auth0

                                        .authentication(session: session)
                                        
                                        .logging(enabled: true))
        

        }()
    private init () { }

}

func plistValues(bundle: Bundle) -> (clientId: String, domain: String)? {
    guard
        let path = bundle.path(forResource: "Auth0", ofType: "plist"),
        let values = NSDictionary(contentsOfFile: path) as? [String: Any]
        else {
            print("Missing Auth0.plist file with 'ClientId' and 'Domain' entries in main bundle!")
            return nil
    }

    guard
        let clientId = values["ClientId"] as? String,
        let domain = values["Domain"] as? String
        else {
            print("Auth0.plist file at \(path) is missing 'ClientId' and/or 'Domain' entries!")
            print("File currently has the following entries: \(values)")
            return nil
    }
    return (clientId: clientId, domain: domain)
}

