/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { http, HttpResponse } from 'msw'
import { messages } from './messages'

let loggedIn = false

export const api = [
    http.get('http://localhost/apps/self-service-portal/api/.well-known', () => {
        return HttpResponse.json(
            {
                "endpoints": {
                    "oauthAgent": "/apps/self-service-portal/api",
                    "userManagement": "/um/graphql/admin",
                    "grantedAuthorization": "/granted-authorization/graphql"
                },
                messages: messages,
                "accessControlPolicy": {
                    "resourceGroups": {
                        "userManagement": {
                            "resources": {
                                "address": {
                                    "operations": [
                                        "read",
                                        "update"
                                    ]
                                },
                                "email": {
                                    "operations": [
                                        "read",
                                        "update"
                                    ]
                                },
                                "name": {
                                    "operations": [
                                        "read",
                                        "update"
                                    ]
                                },
                                "optin-mfa": {
                                    "operations": [
                                        "read",
                                        "setup",
                                        "reset-recovery-codes",
                                        "add-factor",
                                        "remove-factor",
                                        "reset"
                                    ]
                                },
                                "phoneNumber": {
                                    "operations": [
                                        "read",
                                        "update"
                                    ]
                                },
                                "linkedAccounts": {
                                    "operations": [
                                        "read",
                                        "delete"
                                    ]
                                },
                                "totp": {
                                    "operations": [
                                        "read",
                                        "create",
                                        "delete"
                                    ]
                                },
                                "passkey": {
                                    "operations": [
                                        "read",
                                        "create",
                                        "delete"
                                    ]
                                },
                                "password": {
                                    "operations": [
                                        "update"
                                    ]
                                }
                            }
                        },
                        "grantedAuthorizations": {
                            "resources": {
                                "grantedAuthorizations": {
                                    "operations": [
                                        "read",
                                        "delete"
                                    ]
                                }
                            }
                        }
                    }
                }
            })
    }),
    http.get('http://localhost/apps/self-service-portal/api/session', () => {
        return HttpResponse.json({
            "is_logged_in": loggedIn,
        })
    }),
    http.post('http://localhost/apps/self-service-portal/api/login/start', () => {
        return HttpResponse.json({
            "authorization_url": "/previewer?iss=anonymous&code=1234567890&state=foobar&session_state=123.4567890",
        })
    }),
    http.post('http://localhost/apps/self-service-portal/api/login/end', () => {
        loggedIn = true
        return HttpResponse.json({
            "is_logged_in": loggedIn,
            "id_token_claims": {
                "exp": 1763986515,
                "sub": "testuser",
                "auth_time": 1763982915,
                "acr": "urn:se:curity:authentication:username:username",
                "azp": "self-service-portal-app-client",
                "amr": "urn:se:curity:authentication:username:username"
            },
            "access_token_expires_in": 1000000
        })
    }),
    http.post('http://localhost/apps/self-service-portal/api/logout', () => {
        loggedIn = false
        return HttpResponse.json({})
    }),
]