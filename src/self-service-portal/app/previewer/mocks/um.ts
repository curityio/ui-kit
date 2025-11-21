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

import {graphql, HttpResponse} from 'msw'

const umEndpoint = graphql.link('http://localhost/um/graphql/admin')
const account = {
    phone: {
        value: '123456',
        verified: 'null',
    },
    email: {
        value: 'test@example.com',
        verified: 'null',
    },
    addresses: [
        {
            "streetAddress": "Imaginary street 123",
            "locality": "Stockholm",
            "region": null,
            "postalCode": "12345",
            "country": "Sweden",
            "primary": true,
            "type": 'l',
            "__typename": "Address"
        }
    ]
};
const optIn = {
    state: false, factorsIn: [], factorsOut: [
        {
            "acr": "urn:se:curity:authentication:sms:sms-optin-mfa",
            "description": "SMS authentication code",
            "expectedUserName": "testuser",
            "changedAt": 1763711375,
            "type": "sms",
            "hasDevices": false,
            "__typename": "RegisteredFactor"
        },
        {
            "acr": "urn:se:curity:authentication:email:email-optin-mfa",
            "description": "Email authentication code",
            "expectedUserName": "testuser",
            "changedAt": 1763711375,
            "type": "email",
            "hasDevices": false,
            "__typename": "RegistrableFactor"
        },
        {
            "acr": "urn:se:curity:authentication:passkeys:passkeys-optin-mfa",
            "description": "Passkey",
            "expectedUserName": "testuser",
            "type": "passkeys",
            "hasDevices": false,
            "__typename": "RegistrableFactor"
        },
        {
            "acr": "urn:se:curity:authentication:totp:totp-optin-mfa",
            "description": "OTP authenticator app",
            "type": "totp",
            "hasDevices": false,
            "__typename": "RegistrableFactor"
        }
    ]
};

export const um = [
    umEndpoint.query('getAccountByUserName', () => {
        return HttpResponse.json({
            "data": {
                "accountByUserName": {
                    "id": "24b30653-f48e-4059-a6bc-a22d488026e9",
                    "userName": "testuser",
                    "name": {
                        "givenName": "Test",
                        "familyName": "User",
                        "__typename": "Name"
                    },
                    "displayName": "Test User",
                    "nickName": "testuser",
                    "title": null,
                    "locale": "en-US",
                    "timeZone": "Europe/Stockholm",
                    "active": true,
                    "emails": [
                        {
                            "value": account.email.value,
                            "primary": true,
                            "type": account.email.verified,
                            "__typename": "StringMultiValuedValue"
                        }
                    ],
                    "phoneNumbers": [
                        {
                            "value": account.phone.value,
                            "primary": true,
                            "type": account.phone.verified,
                            "__typename": "StringMultiValuedValue"
                        },
                    ],
                    "addresses": account.addresses,
                    "groups": [],
                    "entitlements": [],
                    "roles": [],
                    "meta": {
                        "created": 123,
                        "lastModified": 1763645449,
                        "resourceType": "User",
                        "__typename": "Meta"
                    },
                    "__typename": "Account",
                    "devices": [
                        {
                            "deviceId": "eb3472f4-e02d-41a6-805b-a962da1ff72f",
                            "deviceType": "totp-optin-mfa",
                            "expiresAt": null,
                            "alias": "my-totp",
                            "category": {
                                "name": "totp",
                                "__typename": "DeviceCategory"
                            },
                            "meta": {
                                "created": 1763709385,
                                "lastModified": 1763709385,
                                "resourceType": "Device",
                                "timeZoneId": "UTC",
                                "__typename": "Meta"
                            },
                            "details": {
                                "__typename": "TotpDeviceDetails",
                                "canUseWithTotpAuthenticator": true
                            },
                            "__typename": "Device"
                        },
                        {
                            "deviceId": "TUl9CoqR8GBpgN3Ak2qJFdVRUJs\u003d",
                            "deviceType": "webauthn",
                            "expiresAt": null,
                            "alias": "my-passkey",
                            "category": {
                                "name": "webauthn/passkeys",
                                "__typename": "DeviceCategory"
                            },
                            "meta": {
                                "created": 1763709969,
                                "lastModified": 1763709969,
                                "resourceType": "Device",
                                "timeZoneId": "UTC",
                                "__typename": "Meta"
                            },
                            "details": {
                                "__typename": "WebAuthnDeviceDetails",
                                "webAuthnAuthenticator": {
                                    "name": "iCloud Keychain",
                                    "iconDarkUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIj48cGF0aCBkPSJtMjE3LjM2LDkwLjY5Yy0xNS41OCw5LjU0LTI1LjE3LDI2LjQxLTI1LjM4LDQ0LjY4LjA2LDIwLjY3LDEyLjQzLDM5LjMyLDMxLjQ2LDQ3LjQxLTMuNjcsMTEuODQtOS4xLDIzLjA2LTE2LjExLDMzLjI4LTEwLjAzLDE0LjQ0LTIwLjUyLDI4Ljg3LTM2LjQ3LDI4Ljg3cy0yMC4wNi05LjI3LTM4LjQ1LTkuMjctMjQuMzIsOS41Ny0zOC45LDkuNTctMjQuNzctMTMuMzctMzYuNDctMjkuNzljLTE1LjQ2LTIyLjk5LTIzLjk1LTQ5Ljk2LTI0LjQ3LTc3LjY2LDAtNDUuNTksMjkuNjMtNjkuNzUsNTguODEtNjkuNzUsMTUuNSwwLDI4LjQyLDEwLjE4LDM4LjE1LDEwLjE4czIzLjcxLTEwLjc5LDQxLjM0LTEwLjc5YzE4LjQxLS40NywzNS44NCw4LjI0LDQ2LjUsMjMuMjVabS01NC44Ni00Mi41NWM3Ljc3LTkuMTQsMTIuMTctMjAuNjcsMTIuNDYtMzIuNjcuMDEtMS41OC0uMTQtMy4xNi0uNDYtNC43MS0xMy4zNSwxLjMtMjUuNjksNy42Ny0zNC41LDE3Ljc4LTcuODUsOC43OC0xMi40MSwyMC0xMi45MiwzMS43NiwwLDEuNDMuMTYsMi44Ni40Niw0LjI2LDEuMDUuMiwyLjEyLjMsMy4xOS4zLDEyLjQzLS45OSwyMy45MS03LjA0LDMxLjc2LTE2LjczWiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg\u003d\u003d",
                                    "iconLightUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIj48cGF0aCBkPSJtMjE3LjM2LDkwLjY5Yy0xNS41OCw5LjU0LTI1LjE3LDI2LjQxLTI1LjM4LDQ0LjY4LjA2LDIwLjY3LDEyLjQzLDM5LjMyLDMxLjQ2LDQ3LjQxLTMuNjcsMTEuODQtOS4xLDIzLjA2LTE2LjExLDMzLjI4LTEwLjAzLDE0LjQ0LTIwLjUyLDI4Ljg3LTM2LjQ3LDI4Ljg3cy0yMC4wNi05LjI3LTM4LjQ1LTkuMjctMjQuMzIsOS41Ny0zOC45LDkuNTctMjQuNzctMTMuMzctMzYuNDctMjkuNzljLTE1LjQ2LTIyLjk5LTIzLjk1LTQ5Ljk2LTI0LjQ3LTc3LjY2LDAtNDUuNTksMjkuNjMtNjkuNzUsNTguODEtNjkuNzUsMTUuNSwwLDI4LjQyLDEwLjE4LDM4LjE1LDEwLjE4czIzLjcxLTEwLjc5LDQxLjM0LTEwLjc5YzE4LjQxLS40NywzNS44NCw4LjI0LDQ2LjUsMjMuMjVabS01NC44Ni00Mi41NWM3Ljc3LTkuMTQsMTIuMTctMjAuNjcsMTIuNDYtMzIuNjcuMDEtMS41OC0uMTQtMy4xNi0uNDYtNC43MS0xMy4zNSwxLjMtMjUuNjksNy42Ny0zNC41LDE3Ljc4LTcuODUsOC43OC0xMi40MSwyMC0xMi45MiwzMS43NiwwLDEuNDMuMTYsMi44Ni40Niw0LjI2LDEuMDUuMiwyLjEyLjMsMy4xOS4zLDEyLjQzLS45OSwyMy45MS03LjA0LDMxLjc2LTE2LjczWiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg\u003d\u003d",
                                    "__typename": "WebAuthnAuthenticator"
                                }
                            },
                            "__typename": "Device"
                        }
                    ],
                    "linkedAccounts": [
                        {
                            "value": "testuser@network.y",
                            "domain": "network.y",
                            "created": 1763744400,
                            "__typename": "LinkedAccount"
                        },
                        {
                            "value": "testuser@social.io",
                            "domain": "social.io",
                            "created": 1763658000,
                            "__typename": "LinkedAccount"
                        }
                    ],
                    "mfaOptIn": {
                        "registeredFactors": {
                            "factors": optIn.state ? optIn.factorsIn : [],
                            "__typename": "RegisteredFactors"
                        },
                        "registrableFactors": {
                            "factors": optIn.factorsOut,
                            "__typename": "RegistrableFactors"
                        },
                        "preferences": null,
                        "recoveryCodeBatch": {
                            "batchId": "9518cfa5-147c-4d1f-829b-c10f707452d5",
                            "codes": [
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                },
                                {
                                    "consumed": false,
                                    "consumedAt": null,
                                    "__typename": "RecoveryCodeValidation"
                                }
                            ],
                            "createdAt": 1763711376,
                            "__typename": "RecoveryCodeBatch"
                        },
                        "__typename": "OptinMfa"
                    },
                    "dynamicClients": []
                }
            }
        })
    }),
    umEndpoint.mutation('updateAccountById', ({variables}) => {
        console.log('Update account called', variables.input.fields.addresses);
        account.addresses = variables.input.fields.addresses || account.addresses;
        return HttpResponse.json({
            "data": {
                "updateAccountById": {
                    "account": {
                        "id": "24b30653-f48e-4059-a6bc-a22d488026e9",
                        "userName": "testuser",
                        "name": {
                            "givenName": "Test",
                            "familyName": "User",
                            "__typename": "Name"
                        },
                        "displayName": "Test User",
                        "nickName": "testuser",
                        "title": null,
                        "locale": "en-US",
                        "timeZone": "Europe/Stockholm",
                        "active": true,
                        "emails": [
                            {
                                "value": account.email.value,
                                "primary": true,
                                "type": account.email.verified,
                                "__typename": "StringMultiValuedValue"
                            }
                        ],
                        "phoneNumbers": [
                            {
                                "value": account.phone.value,
                                "primary": true,
                                "type": account.phone.verified,
                                "__typename": "StringMultiValuedValue"
                            },
                        ],
                        "addresses": account.addresses,
                        "groups": [],
                        "entitlements": [],
                        "roles": [],
                        "meta": {
                            "created": 123,
                            "lastModified": 1763645449,
                            "resourceType": "User",
                            "__typename": "Meta"
                        },
                        "__typename": "Account",
                        "devices": [
                            {
                                "deviceId": "eb3472f4-e02d-41a6-805b-a962da1ff72f",
                                "deviceType": "totp-optin-mfa",
                                "expiresAt": null,
                                "alias": "my-totp",
                                "category": {
                                    "name": "totp",
                                    "__typename": "DeviceCategory"
                                },
                                "meta": {
                                    "created": 1763709385,
                                    "lastModified": 1763709385,
                                    "resourceType": "Device",
                                    "timeZoneId": "UTC",
                                    "__typename": "Meta"
                                },
                                "details": {
                                    "__typename": "TotpDeviceDetails",
                                    "canUseWithTotpAuthenticator": true
                                },
                                "__typename": "Device"
                            },
                            {
                                "deviceId": "TUl9CoqR8GBpgN3Ak2qJFdVRUJs\u003d",
                                "deviceType": "webauthn",
                                "expiresAt": null,
                                "alias": "my-passkey",
                                "category": {
                                    "name": "webauthn/passkeys",
                                    "__typename": "DeviceCategory"
                                },
                                "meta": {
                                    "created": 1763709969,
                                    "lastModified": 1763709969,
                                    "resourceType": "Device",
                                    "timeZoneId": "UTC",
                                    "__typename": "Meta"
                                },
                                "details": {
                                    "__typename": "WebAuthnDeviceDetails",
                                    "webAuthnAuthenticator": {
                                        "name": "iCloud Keychain",
                                        "iconDarkUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIj48cGF0aCBkPSJtMjE3LjM2LDkwLjY5Yy0xNS41OCw5LjU0LTI1LjE3LDI2LjQxLTI1LjM4LDQ0LjY4LjA2LDIwLjY3LDEyLjQzLDM5LjMyLDMxLjQ2LDQ3LjQxLTMuNjcsMTEuODQtOS4xLDIzLjA2LTE2LjExLDMzLjI4LTEwLjAzLDE0LjQ0LTIwLjUyLDI4Ljg3LTM2LjQ3LDI4Ljg3cy0yMC4wNi05LjI3LTM4LjQ1LTkuMjctMjQuMzIsOS41Ny0zOC45LDkuNTctMjQuNzctMTMuMzctMzYuNDctMjkuNzljLTE1LjQ2LTIyLjk5LTIzLjk1LTQ5Ljk2LTI0LjQ3LTc3LjY2LDAtNDUuNTksMjkuNjMtNjkuNzUsNTguODEtNjkuNzUsMTUuNSwwLDI4LjQyLDEwLjE4LDM4LjE1LDEwLjE4czIzLjcxLTEwLjc5LDQxLjM0LTEwLjc5YzE4LjQxLS40NywzNS44NCw4LjI0LDQ2LjUsMjMuMjVabS01NC44Ni00Mi41NWM3Ljc3LTkuMTQsMTIuMTctMjAuNjcsMTIuNDYtMzIuNjcuMDEtMS41OC0uMTQtMy4xNi0uNDYtNC43MS0xMy4zNSwxLjMtMjUuNjksNy42Ny0zNC41LDE3Ljc4LTcuODUsOC43OC0xMi40MSwyMC0xMi45MiwzMS43NiwwLDEuNDMuMTYsMi44Ni40Niw0LjI2LDEuMDUuMiwyLjEyLjMsMy4xOS4zLDEyLjQzLS45OSwyMy45MS03LjA0LDMxLjc2LTE2LjczWiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg\u003d\u003d",
                                        "iconLightUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIj48cGF0aCBkPSJtMjE3LjM2LDkwLjY5Yy0xNS41OCw5LjU0LTI1LjE3LDI2LjQxLTI1LjM4LDQ0LjY4LjA2LDIwLjY3LDEyLjQzLDM5LjMyLDMxLjQ2LDQ3LjQxLTMuNjcsMTEuODQtOS4xLDIzLjA2LTE2LjExLDMzLjI4LTEwLjAzLDE0LjQ0LTIwLjUyLDI4Ljg3LTM2LjQ3LDI4Ljg3cy0yMC4wNi05LjI3LTM4LjQ1LTkuMjctMjQuMzIsOS41Ny0zOC45LDkuNTctMjQuNzctMTMuMzctMzYuNDctMjkuNzljLTE1LjQ2LTIyLjk5LTIzLjk1LTQ5Ljk2LTI0LjQ3LTc3LjY2LDAtNDUuNTksMjkuNjMtNjkuNzUsNTguODEtNjkuNzUsMTUuNSwwLDI4LjQyLDEwLjE4LDM4LjE1LDEwLjE4czIzLjcxLTEwLjc5LDQxLjM0LTEwLjc5YzE4LjQxLS40NywzNS44NCw4LjI0LDQ2LjUsMjMuMjVabS01NC44Ni00Mi41NWM3Ljc3LTkuMTQsMTIuMTctMjAuNjcsMTIuNDYtMzIuNjcuMDEtMS41OC0uMTQtMy4xNi0uNDYtNC43MS0xMy4zNSwxLjMtMjUuNjksNy42Ny0zNC41LDE3Ljc4LTcuODUsOC43OC0xMi40MSwyMC0xMi45MiwzMS43NiwwLDEuNDMuMTYsMi44Ni40Niw0LjI2LDEuMDUuMiwyLjEyLjMsMy4xOS4zLDEyLjQzLS45OSwyMy45MS03LjA0LDMxLjc2LTE2LjczWiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg\u003d\u003d",
                                        "__typename": "WebAuthnAuthenticator"
                                    }
                                },
                                "__typename": "Device"
                            }
                        ],
                        "linkedAccounts": [
                            {
                                "value": "testuser@network.y",
                                "domain": "network.y",
                                "created": 1763744400,
                                "__typename": "LinkedAccount"
                            },
                            {
                                "value": "testuser@social.io",
                                "domain": "social.io",
                                "created": 1763658000,
                                "__typename": "LinkedAccount"
                            }
                        ],
                        "mfaOptIn": {
                            "registeredFactors": {
                                "factors": optIn.state ? optIn.factorsIn : [],
                                "__typename": "RegisteredFactors"
                            },
                            "registrableFactors": {
                                "factors": optIn.factorsOut,
                                "__typename": "RegistrableFactors"
                            },
                            "preferences": null,
                            "recoveryCodeBatch": {
                                "batchId": "9518cfa5-147c-4d1f-829b-c10f707452d5",
                                "codes": [
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    }
                                ],
                                "createdAt": 1763711376,
                                "__typename": "RecoveryCodeBatch"
                            },
                            "__typename": "OptinMfa"
                        },
                        "dynamicClients": []
                    },
                    "__typename": "UpdateAccountByIdPayload",
                }
            }
        })
    }),

    umEndpoint.mutation('startVerifyPhoneNumberByAccountId', () => {
        return HttpResponse.json({
            "data": {
                "startVerifyPhoneNumberByAccountId": {
                    "result": true,
                    "state": "1977179839391363",
                    "__typename": "StartVerifyPhoneNumberByAccountIdPayload"
                }
            }
        })
    }),
    umEndpoint.mutation('completeVerifyPhoneNumberByAccountId', ({variables}) => {
        const success = {
            "data": {
                "completeVerifyPhoneNumberByAccountId": {
                    "result": true,
                    "__typename": "CompleteVerifyPhoneNumberByAccountIdPayload"
                }
            }
        };
        const failure = {
            "data": {
                "completeVerifyPhoneNumberByAccountId": null
            },
            "errors": [
                {
                    "message": "Exception while fetching data (/completeVerifyPhoneNumberByAccountId) : Invalid or unknown one time password provided.",
                    "locations": [
                        {
                            "line": 2,
                            "column": 3
                        }
                    ],
                    "path": [
                        "completeVerifyPhoneNumberByAccountId"
                    ],
                    "extensions": {
                        "classification": "DataFetchingException"
                    }
                }
            ]
        };
        if (variables.input.otp === '123456') {
            account.phone.verified = 'verified';
            const factor = optIn.factorsOut.find(
                f => f.acr === 'urn:se:curity:authentication:sms:sms-optin-mfa'
            );
            if (factor) {
                factor.hasDevices = true;
            }
            return HttpResponse.json(success);
        }
        return HttpResponse.json(failure);
    }),
    umEndpoint.mutation('updatePrimaryPhoneNumberByAccountId', ({variables}) => {
        account.phone.value = variables.input.newPrimaryPhoneNumber;
        account.phone.verified = 'verified';
        return HttpResponse.json({
            "data": {
                "updatePrimaryPhoneNumberByAccountId": {
                    "result": true,
                    "__typename": "UpdatePrimaryPhoneNumberByAccountIdPayload"
                }
            }
        })
    }),

    umEndpoint.mutation('startVerifyEmailAddressByAccountId', () => {
        return HttpResponse.json({
            "data": {
                "startVerifyEmailAddressByAccountId": {
                    "result": true,
                    "state": "7476357563627466",
                    "__typename": "StartVerifyEmailAddressByAccountIdPayload"
                }
            }
        })
    }),
    umEndpoint.mutation('completeVerifyEmailAddressByAccountId', ({variables}) => {
        const success = {
            "data": {
                "completeVerifyEmailAddressByAccountId": {
                    "result": true,
                    "__typename": "CompleteVerifyEmailAddressByAccountIdPayload"
                }
            }
        };
        const failure = {
            "data": {
                "completeVerifyEmailAddressByAccountId": null
            },
            "errors": [
                {
                    "message": "Exception while fetching data (/completeVerifyEmailAddressByAccountId) : Invalid or unknown one time password provided.",
                    "locations": [
                        {
                            "line": 2,
                            "column": 3
                        }
                    ],
                    "path": [
                        "completeVerifyEmailAddressByAccountId"
                    ],
                    "extensions": {
                        "classification": "DataFetchingException"
                    }
                }
            ]
        };
        if (variables.input.otp === '123456') {
            account.email.verified = 'verified';
            const factor = optIn.factorsOut.find(
                f => f.acr === 'urn:se:curity:authentication:email:email-optin-mfa'
            );
            if (factor) {
                factor.hasDevices = true;
            }
            return HttpResponse.json(success);
        }
        return HttpResponse.json(failure);
    }),
    umEndpoint.mutation('updatePrimaryEmailAddressByAccountId', () => {
        return HttpResponse.json({
            "data": {
                "updatePrimaryEmailAddressByAccountId": {
                    "result": true,
                    "__typename": "UpdatePrimaryEmailAddressByAccountIdPayload"
                }
            }
        })
    }),

    umEndpoint.mutation('startVerifyTotpDeviceByAccountId', () => {
        return HttpResponse.json({
            "data": {
                "startVerifyTotpDeviceByAccountId": {
                    "state": "2526404045881167",
                    "deviceId": "2ececdaf-4941-415e-bfe8-0314400bc89b",
                    "issuer": "Curity Identity Server",
                    "key": "CR7PCV546BL3W6G3MD7J5E6QIULPMYXW",
                    "digits": 6,
                    "interval": 30,
                    "algorithm": "SHA256",
                    "skew": 1,
                    "delayWindow": 1,
                    "deviceType": "totp-optin-mfa",
                    "deviceExpiresIn": null,
                    "qrLink": "otpauth://totp/Curity+Identity+Server:otp+auth?secret\u003dCR7PCV546BL3W6G3MD7J5E6QIULPMYXW\u0026issuer\u003dCurity+Identity+Server\u0026digits\u003d6\u0026period\u003d30\u0026algorithm\u003dSHA256",
                    "__typename": "StartVerifyTotpDeviceByAccountIdPayload"
                }
            }
        })
    }),
    umEndpoint.mutation('completeVerifyTotpDeviceByAccountId', ({variables}) => {
        const success = {
            "data": {
                "completeVerifyTotpDeviceByAccountId": {
                    "result": true,
                    "__typename": "CompleteVerifyTotpDeviceByAccountIdPayload"
                }
            }
        };
        const failure = {
            "data": {
                "completeVerifyTotpDeviceByAccountId": null
            },
            "errors": [
                {
                    "message": "Exception while fetching data (/completeVerifyTotpDeviceByAccountId) : Could not verify the TOTP response.",
                    "locations": [
                        {
                            "line": 2,
                            "column": 3
                        }
                    ],
                    "path": [
                        "completeVerifyTotpDeviceByAccountId"
                    ],
                    "extensions": {
                        "classification": "DataFetchingException"
                    }
                }
            ]
        };
        return HttpResponse.json((variables.input.totp === '123456') ? success : failure);
    }),
    umEndpoint.mutation('deleteDeviceFromAccountByAccountId', () => {
        return HttpResponse.json({
            "data": {
                "deleteDeviceFromAccountByAccountId": {
                    "deleted": true,
                    "__typename": "DeleteDeviceFromAccountByAccountIdPayload"
                }
            }
        })
    }),

    umEndpoint.mutation('startVerifyPasskeyByAccountId', () => {
        return HttpResponse.json({
            "data": {
                "startVerifyPasskeyByAccountId": {
                    "state": "0699423738437144",
                    "credentialOptionsJson": "eyJwdWJsaWNLZXkiOnsicnAiOnsibmFtZSI6InNlLmN1cml0eSIsImlkIjoibG9jYWxob3N0In0sInVzZXIiOnsibmFtZSI6ImpvaG5kb2UiLCJkaXNwbGF5TmFtZSI6ImpvaG5kb2UiLCJpZCI6InduRTdZc2tEZVJ2ZV9GcHFtZDhFMURNTjVKRzd4NkRLYWxBSE0zNUtZQ2cifSwiY2hhbGxlbmdlIjoiUVJEQm82YTBBUU5rMzM4OFhJM2NVSlVqUURTMDUxcjVwcFExV29fUEJsbyIsInB1YktleUNyZWRQYXJhbXMiOlt7ImFsZyI6LTcsInR5cGUiOiJwdWJsaWMta2V5In0seyJhbGciOi04LCJ0eXBlIjoicHVibGljLWtleSJ9LHsiYWxnIjotMzUsInR5cGUiOiJwdWJsaWMta2V5In0seyJhbGciOi0zNiwidHlwZSI6InB1YmxpYy1rZXkifSx7ImFsZyI6LTI1NywidHlwZSI6InB1YmxpYy1rZXkifSx7ImFsZyI6LTI1OCwidHlwZSI6InB1YmxpYy1rZXkifSx7ImFsZyI6LTI1OSwidHlwZSI6InB1YmxpYy1rZXkifV0sImhpbnRzIjpbXSwiZXhjbHVkZUNyZWRlbnRpYWxzIjpbXSwiYXV0aGVudGljYXRvclNlbGVjdGlvbiI6eyJyZXF1aXJlUmVzaWRlbnRLZXkiOmZhbHNlLCJyZXNpZGVudEtleSI6InByZWZlcnJlZCIsInVzZXJWZXJpZmljYXRpb24iOiJyZXF1aXJlZCJ9LCJhdHRlc3RhdGlvbiI6Im5vbmUiLCJleHRlbnNpb25zIjp7fX19",
                    "__typename": "StartVerifyPasskeyByAccountIdPayload"
                }
            }
        })
    }),
    umEndpoint.mutation('completeVerifyPasskeyByAccountId', () => {
        return HttpResponse.json({
            "data": {
                "completeVerifyPasskeyByAccountId": {
                    "result": true,
                    "__typename": "CompleteVerifyPasskeyByAccountIdPayload"
                }
            }
        })
    }),

    umEndpoint.mutation('startOptInMfaSetupByAccountId', ({variables}) => {
        variables?.input?.factors.forEach((factor: { acr: string }) => {
            let index = optIn.factorsOut.findIndex(f => f.acr === factor.acr);
            if (index !== -1) {
                optIn.factorsIn.push(optIn.factorsOut[index]);
                optIn.factorsOut.splice(index, 1);
            }
        });
        return HttpResponse.json({
            "data": {
                "startOptInMfaSetupByAccountId": {
                    "factors": optIn.factorsIn,
                    "recoveryCodes": [
                        {
                            "value": "00000001",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000002",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000003",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000004",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000005",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000006",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000007",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000008",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000009",
                            "__typename": "OptInMfaRecoveryCode"
                        },
                        {
                            "value": "00000010",
                            "__typename": "OptInMfaRecoveryCode"
                        }
                    ],
                    "state": "XNn6svmqS6tor4jlQlh0ZVhGLR88tUvG",
                    "__typename": "StartOptInMfaSetupByAccountIdPayload"
                }
            }
        })
    }),
    umEndpoint.mutation('completeOptInMfaSetupByAccountId', () => {
        optIn.state = true;
        return HttpResponse.json({
            "data": {
                "completeOptInMfaSetupByAccountId": {
                    "account": {
                        "id": "24b30653-f48e-4059-a6bc-a22d488026e9",
                        "userName": "testuser",
                        "name": {
                            "givenName": "Test",
                            "familyName": "User",
                            "__typename": "Name"
                        },
                        "displayName": "Test User",
                        "nickName": "testuser",
                        "title": null,
                        "locale": "en-US",
                        "timeZone": "Europe/Stockholm",
                        "active": true,
                        "emails": [
                            {
                                "value": "test@example.com",
                                "primary": true,
                                "type": null,
                                "__typename": "StringMultiValuedValue"
                            }
                        ],
                        "phoneNumbers": [
                            {
                                "value": "123456",
                                "primary": true,
                                "type": null,
                                "__typename": "StringMultiValuedValue"
                            },
                            {
                                "value": "1234567890",
                                "primary": false,
                                "type": null,
                                "__typename": "StringMultiValuedValue"
                            }
                        ],
                        "addresses": [
                            {
                                "streetAddress": "Imaginary street 123",
                                "locality": "Stockholm",
                                "region": null,
                                "postalCode": "12345",
                                "country": "Sweden",
                                "primary": true,
                                "type": null,
                                "__typename": "Address"
                            }
                        ],
                        "groups": [],
                        "entitlements": [],
                        "roles": [],
                        "meta": {
                            "created": 123,
                            "lastModified": 1763645449,
                            "resourceType": "User",
                            "__typename": "Meta"
                        },
                        "__typename": "Account",
                        "devices": [
                            {
                                "deviceId": "eb3472f4-e02d-41a6-805b-a962da1ff72f",
                                "deviceType": "totp-optin-mfa",
                                "expiresAt": null,
                                "alias": "my-totp",
                                "category": {
                                    "name": "totp",
                                    "__typename": "DeviceCategory"
                                },
                                "meta": {
                                    "created": 1763709385,
                                    "lastModified": 1763709385,
                                    "resourceType": "Device",
                                    "timeZoneId": "UTC",
                                    "__typename": "Meta"
                                },
                                "details": {
                                    "__typename": "TotpDeviceDetails",
                                    "canUseWithTotpAuthenticator": true
                                },
                                "__typename": "Device"
                            },
                            {
                                "deviceId": "TUl9CoqR8GBpgN3Ak2qJFdVRUJs\u003d",
                                "deviceType": "webauthn",
                                "expiresAt": null,
                                "alias": "my-passkey",
                                "category": {
                                    "name": "webauthn/passkeys",
                                    "__typename": "DeviceCategory"
                                },
                                "meta": {
                                    "created": 1763709969,
                                    "lastModified": 1763709969,
                                    "resourceType": "Device",
                                    "timeZoneId": "UTC",
                                    "__typename": "Meta"
                                },
                                "details": {
                                    "__typename": "WebAuthnDeviceDetails",
                                    "webAuthnAuthenticator": {
                                        "name": "iCloud Keychain",
                                        "iconDarkUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIj48cGF0aCBkPSJtMjE3LjM2LDkwLjY5Yy0xNS41OCw5LjU0LTI1LjE3LDI2LjQxLTI1LjM4LDQ0LjY4LjA2LDIwLjY3LDEyLjQzLDM5LjMyLDMxLjQ2LDQ3LjQxLTMuNjcsMTEuODQtOS4xLDIzLjA2LTE2LjExLDMzLjI4LTEwLjAzLDE0LjQ0LTIwLjUyLDI4Ljg3LTM2LjQ3LDI4Ljg3cy0yMC4wNi05LjI3LTM4LjQ1LTkuMjctMjQuMzIsOS41Ny0zOC45LDkuNTctMjQuNzctMTMuMzctMzYuNDctMjkuNzljLTE1LjQ2LTIyLjk5LTIzLjk1LTQ5Ljk2LTI0LjQ3LTc3LjY2LDAtNDUuNTksMjkuNjMtNjkuNzUsNTguODEtNjkuNzUsMTUuNSwwLDI4LjQyLDEwLjE4LDM4LjE1LDEwLjE4czIzLjcxLTEwLjc5LDQxLjM0LTEwLjc5YzE4LjQxLS40NywzNS44NCw4LjI0LDQ2LjUsMjMuMjVabS01NC44Ni00Mi41NWM3Ljc3LTkuMTQsMTIuMTctMjAuNjcsMTIuNDYtMzIuNjcuMDEtMS41OC0uMTQtMy4xNi0uNDYtNC43MS0xMy4zNSwxLjMtMjUuNjksNy42Ny0zNC41LDE3Ljc4LTcuODUsOC43OC0xMi40MSwyMC0xMi45MiwzMS43NiwwLDEuNDMuMTYsMi44Ni40Niw0LjI2LDEuMDUuMiwyLjEyLjMsMy4xOS4zLDEyLjQzLS45OSwyMy45MS03LjA0LDMxLjc2LTE2LjczWiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg\u003d\u003d",
                                        "iconLightUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIj48cGF0aCBkPSJtMjE3LjM2LDkwLjY5Yy0xNS41OCw5LjU0LTI1LjE3LDI2LjQxLTI1LjM4LDQ0LjY4LjA2LDIwLjY3LDEyLjQzLDM5LjMyLDMxLjQ2LDQ3LjQxLTMuNjcsMTEuODQtOS4xLDIzLjA2LTE2LjExLDMzLjI4LTEwLjAzLDE0LjQ0LTIwLjUyLDI4Ljg3LTM2LjQ3LDI4Ljg3cy0yMC4wNi05LjI3LTM4LjQ1LTkuMjctMjQuMzIsOS41Ny0zOC45LDkuNTctMjQuNzctMTMuMzctMzYuNDctMjkuNzljLTE1LjQ2LTIyLjk5LTIzLjk1LTQ5Ljk2LTI0LjQ3LTc3LjY2LDAtNDUuNTksMjkuNjMtNjkuNzUsNTguODEtNjkuNzUsMTUuNSwwLDI4LjQyLDEwLjE4LDM4LjE1LDEwLjE4czIzLjcxLTEwLjc5LDQxLjM0LTEwLjc5YzE4LjQxLS40NywzNS44NCw4LjI0LDQ2LjUsMjMuMjVabS01NC44Ni00Mi41NWM3Ljc3LTkuMTQsMTIuMTctMjAuNjcsMTIuNDYtMzIuNjcuMDEtMS41OC0uMTQtMy4xNi0uNDYtNC43MS0xMy4zNSwxLjMtMjUuNjksNy42Ny0zNC41LDE3Ljc4LTcuODUsOC43OC0xMi40MSwyMC0xMi45MiwzMS43NiwwLDEuNDMuMTYsMi44Ni40Niw0LjI2LDEuMDUuMiwyLjEyLjMsMy4xOS4zLDEyLjQzLS45OSwyMy45MS03LjA0LDMxLjc2LTE2LjczWiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg\u003d\u003d",
                                        "__typename": "WebAuthnAuthenticator"
                                    }
                                },
                                "__typename": "Device"
                            }
                        ],
                        "linkedAccounts": [
                            {
                                "value": "testuser@network.y",
                                "domain": "network.y",
                                "created": 1763744400,
                                "__typename": "LinkedAccount"
                            },
                            {
                                "value": "testuser@social.io",
                                "domain": "social.io",
                                "created": 1763658000,
                                "__typename": "LinkedAccount"
                            }
                        ],
                        "mfaOptIn": {
                            "registeredFactors": {
                                "factors": optIn.factorsIn,
                                "__typename": "RegisteredFactors"
                            },
                            "registrableFactors": {
                                "factors": [
                                    {
                                        "acr": "urn:se:curity:authentication:sms:sms-optin-mfa",
                                        "description": "SMS authentication code",
                                        "type": "sms",
                                        "hasDevices": false,
                                        "__typename": "RegistrableFactor"
                                    },
                                    {
                                        "acr": "urn:se:curity:authentication:email:email-optin-mfa",
                                        "description": "Email authentication code",
                                        "type": "email",
                                        "hasDevices": false,
                                        "__typename": "RegistrableFactor"
                                    },
                                    {
                                        "acr": "urn:se:curity:authentication:passkeys:passkeys-optin-mfa",
                                        "description": "Passkey",
                                        "type": "passkeys",
                                        "hasDevices": false,
                                        "__typename": "RegistrableFactor"
                                    },
                                    {
                                        "acr": "urn:se:curity:authentication:totp:totp-optin-mfa",
                                        "description": "OTP authenticator app",
                                        "type": "totp",
                                        "hasDevices": false,
                                        "__typename": "RegistrableFactor"
                                    }
                                ],
                                "__typename": "RegistrableFactors"
                            },
                            "preferences": null,
                            "recoveryCodeBatch": {
                                "batchId": "9518cfa5-147c-4d1f-829b-c10f707452d5",
                                "codes": [
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    },
                                    {
                                        "consumed": false,
                                        "consumedAt": null,
                                        "__typename": "RecoveryCodeValidation"
                                    }
                                ],
                                "createdAt": 1763711376,
                                "__typename": "RecoveryCodeBatch"
                            },
                            "__typename": "OptinMfa"
                        },
                        "dynamicClients": []
                    },
                    "__typename": "CompleteOptInMfaSetupByAccountIdPayload"
                }
            }
        })
    }),

    umEndpoint.query('getCredentialPolicy', () => {
        return HttpResponse.json({
            "data": {
                "credentialPolicy": {
                    "credentialUpdateRules": [
                        {
                            "__typename": "MinimumDigitsPasswordRule",
                            "message": "Minimum digits",
                            "detailedMessage": "Minimum number of digits (0-9)",
                            "minimum": 2
                        },
                        {
                            "__typename": "MinimumUniquePasswordRule",
                            "message": "Minimum unique characters",
                            "detailedMessage": "Minimum number of unique characters",
                            "minimum": 1
                        },
                        {
                            "__typename": "MinimumLengthPasswordRule",
                            "message": "Minimum length",
                            "detailedMessage": "Minimum number of characters",
                            "minimum": 7
                        },
                        {
                            "__typename": "MinimumLowerCasePasswordRule",
                            "message": "Minimum lower case letters",
                            "detailedMessage": "Minimum number of lower case letters (ex. a-z)",
                            "minimum": 2
                        },
                        {
                            "__typename": "MinimumUpperCasePasswordRule",
                            "message": "Minimum upper case letters",
                            "detailedMessage": "Minimum number of upper case letters (ex. A-Z)",
                            "minimum": 3
                        },
                        {
                            "__typename": "MinimumSpecialPasswordRule",
                            "message": "Minimum special characters",
                            "detailedMessage": "Minimum number of special characters (ex. #@!-+)",
                            "minimum": 1
                        },
                        {
                            "__typename": "MaximumSequencePasswordRule",
                            "message": "Maximum in well-known sequences",
                            "detailedMessage": "Maximum number of consecutive characters from well-known sequences, such as alphabet, numbers, and keyboard key rows (ex. abcd..., 1234...)",
                            "maximum": 3
                        }
                    ],
                    "__typename": "CredentialPolicyDescriptor"
                }
            }
        })
    })
]