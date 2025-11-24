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
                "messages": {
                    "security.otp-authenticators.scan-and-enter": "Scan the QR code with your device and enter the {{digits}}-digit code sent to you to complete verification. This ensures a secure and seamless experience.",
                    "cancel": "Cancel",
                    "security.multi-factor-authentication.reset-title": "Reset Multi-Factor Authentication?",
                    "security.password.new-password": "New password",
                    "account.contact-information": "Contact information",
                    "error.security.multi-factor-authentication.fetch-authorizations-by-owner": "Failed to retrieve granted authorizations by owner.",
                    "account.email.email-address": "Email address",
                    "error.security.otp-authenticators.delete": "Failed to delete OTP authenticator from account.",
                    "security.multi-factor-authentication.codes-available": "{{codesAvailable}} codes available",
                    "security.passkeys.title": "Passkeys",
                    "go-home": "Go home",
                    "create-and-verify": "Create and verify",
                    "error.security.multi-factor-authentication.recovery-start": "Failed to start MFA recovery codes reset for account.",
                    "apps-and-services.app-detail": "App Detail",
                    "account.email.check-inbox": "Check your inbox",
                    "error.security.otp-authenticators.one-device-only": "Only one OTP authenticator can be registered.",
                    "welcome": "Welcome",
                    "security.multi-factor-authentication.path": "Security / Multi-factor Authentication",
                    "error.security.multi-factor-authentication.revoke-authorizations-by-owner-client": "Failed to revoke granted authorizations by owner and client.",
                    "error.account.delete": "Failed to delete account.",
                    "session.authorized-client": "Authorized client",
                    "account.phone.verification": "Phone Verification",
                    "security.multi-factor-authentication.turn-on": "Turn on Multi-factor Authentication",
                    "edit": "Edit",
                    "page-not-found-message": "Sorry, the page you\u0027re looking for doesn\u0027t exist",
                    "security.multi-factor-authentication.methods": "Authentication methods",
                    "error.security.password.fetch-policy": "Failed to retrieve credential policy.",
                    "security.otp-authenticators.authenticator": "authenticator",
                    "account.email.verify": "Verify Email Address",
                    "security.no-email-added": "No email addresses added yet",
                    "session.authorized-client-name": "Authorized client name",
                    "account.send-code": "Send Verification Code",
                    "account.email.code-sent": "We emailed you a 6-digit code sent to your email. Enter the code below to verify your email address.",
                    "confirm-delete": "Are you sure you want to delete this item? This action cannot be undone.",
                    "security.otp-authenticators.none-added": "No {{deviceTitle}} added yet",
                    "error.account.phone.update-primary": "Failed to update primary phone number.",
                    "security.multi-factor-authentication.disable-method": "Disable authentication method",
                    "security.otp-authenticators.scan-and-verify": "Scan and Verify Your Code",
                    "apps-and-services.has-access": "has access to",
                    "actions": "Actions",
                    "account.email.verification": "Email Verification",
                    "security.multi-factor-authentication.recovery-codes": "Recovery Codes",
                    "account.address.locality": "Locality",
                    "account.phone.enter-code": "We have sent a 6-digit code to your phone number. Enter the code below to verify your phone number",
                    "error.account.fetch-by-username": "Failed to retrieve account by username.",
                    "apps-and-services.partial-access": "has some access to your Curity Account",
                    "security.password.update-success": "Your password has been successfully updated!",
                    "security.password.requirements": "Password requirements",
                    "error.account.phone.delete": "Failed to delete phone number.",
                    "account.address.path": "Account / Address",
                    "session.time-remaining": "Session time remaining",
                    "search": "Search",
                    "error.linked-accounts.delete": "Failed to delete linked account.",
                    "account.created": "Created",
                    "account.address.street-placeholder": "123 Main St",
                    "security.how-to-log-in-to-your-account": "How to log in to your Account",
                    "security.multi-factor-authentication.confirm-disable": "Are you sure you want to disable {{factorName}} authentication method? This action cannot be undone.",
                    "account.title": "Account",
                    "security.multi-factor-authentication.enable-requirement": "Enable at least one to continue. If you don\u0027t have a device you may need to create one first.",
                    "security.multi-factor-authentication.disabled-warning": "Multi-factor Authentication is currently disabled for your account. You opted out on {{optOutAtDate}}. You can reset and enable MFA again. Enabling MFA will happen on the next authentication.",
                    "security.passkeys.passkey": "Passkey",
                    "account.verify-code": "Verify Code",
                    "account.phone.verify": "Verify Phone Number",
                    "security.multi-factor-authentication.methods-selected.continue": "Continue",
                    "error.security.multi-factor-authentication.recovery-complete": "Failed to complete MFA recovery codes reset for account.",
                    "security.multi-factor-authentication.add-new": "New",
                    "confirm": "Confirm",
                    "error.security.multi-factor-authentication.revoke-authorizations-by-owner": "Failed to revoke granted authorizations by owner.",
                    "apps-and-services.access-given": "Access you\u0027ve given to",
                    "account.address.region": "Region",
                    "account.dialog-title": "Dialog Title",
                    "empty-state-icon": "Empty state icon",
                    "security.multi-factor-authentication.enable": "Enable",
                    "self-service-portal": "Self Service Portal",
                    "security.password.description": "Set a new password. Ensure it meets any required complexity and security policies, if applicable.",
                    "account.email.info": "We\u0027ll send a verification code to this email address",
                    "security.otp-authenticators.path": "Security / OTP Authenticators",
                    "security.password.path": "Security / Password",
                    "error.account.create": "Failed to create account.",
                    "security.multi-factor-authentication.replace-recovery-title": "Replace Recovery Codes?",
                    "account.processing": "Processing",
                    "security.otp-authenticators.authenticators": "authenticators",
                    "sign-in-message": "Sign in to Manage your account",
                    "account.email": "Email",
                    "no-results-found": "No results found",
                    "security.otp-authenticators.creation": "OTP Authenticator Creation",
                    "apps-and-services.feature-warning": "If you remove access, you might not be able to use some {{appId}} features",
                    "security.multi-factor-authentication.inactive": "Currently not used for your account",
                    "error.security.otp-authenticators.update": "Failed to update OTP authenticator on account.",
                    "name": "Name",
                    "account.phone": "Phone",
                    "page": "page",
                    "security.password.confirm-new-password": "Confirm new password",
                    "apps-and-services.not-found": "No apps or services found",
                    "security.otp-authenticators.title": "OTP Authenticators",
                    "account.verifying-code": "Verifying code...",
                    "security.passkeys.device": "Device",
                    "error.account.email.send-code": "Failed to send verification code. Please retry.",
                    "account.address.type-placeholder": "For example \"work\" or \"private\"",
                    "error.security.multi-factor-authentication.fetch-authorizations-by-owner-client": "Failed to retrieve granted authorizations by owner and client.",
                    "account.addresses": "Addresses",
                    "monogram-avatar": "Monogram avatar",
                    "error.account.fetch-by-phone": "Failed to retrieve account by phone number.",
                    "security.multi-factor-authentication.keep-recovery-note": "Keep these recovery codes somewhere safe but accessible.",
                    "security.multi-factor-authentication.reset-warning": "Resetting Multi-factor Authentication will remove all your current authentication methods. You can set up MFA again at your next login.",
                    "error.account.phone.complete-verification": "Failed to complete phone number verification. Please try again.",
                    "security.multi-factor-authentication.not-used-warning": "Multi-factor Authentication (MFA) is currently not used for your account. Your account is not fully protected! Use MFA to keep your account safe from unauthorized access.",
                    "start": "Start",
                    "security.multi-factor-authentication.enabled": "Enabled",
                    "empty-state-list": "Looks like you don\u0027t have any {{title}} yet.",
                    "editing": "Editing",
                    "account.phone.new": "New Phone Number",
                    "security.multi-factor-authentication.title": "Multi-factor Authentication",
                    "error.account.update": "Failed to update account.",
                    "security.access-reminder": "Make sure these details are up-to-date so you can always access your Account",
                    "security.multi-factor-authentication.on": "On",
                    "account.email.verified": "Email Address Verified",
                    "view-details": "View Details",
                    "security.passkeys.new": "New Passkey",
                    "apps-and-services.remove-all": "Remove all access",
                    "feature-not-available": "Feature Not Available",
                    "security.multi-factor-authentication.available-methods": "Available Authentication Methods",
                    "security.passkeys.path": "Security / Passkeys",
                    "linked-accounts.foreign-account-username": "Foreign Account Username",
                    "add-new": "Add a new {{createButtonLabel}} to get started.",
                    "type": "Type",
                    "linked-accounts.description": "Account Linking is the task of binding a foreign account to a local account.",
                    "security.multi-factor-authentication.methods-selected": "methods selected",
                    "close-dialog": "Close dialog",
                    "security.otp-authenticators.device-id": "Device ID",
                    "feature-missing": "The configuration for this app does not include the feature you are trying to access.",
                    "security.title": "Security",
                    "sidebar": "Sidebar",
                    "error.security.password.validate-update": "Failed to validate and update password.",
                    "add-methods": "Add methods",
                    "account.address.postal-code": "Postal Code",
                    "session.description": "Your account is currently logged into multiple authenticators or browsers, creating sessions that allow you to stay connected across platforms. Each session represents an active login that securely stores an access token to keep you authenticated",
                    "account.email.invalid": "Please enter a valid email address",
                    "account.street": "Street",
                    "adjust-search": "Adjust your search and try again.",
                    "account.primary": "Primary",
                    "error.account.phone.send-code": "Failed to send verification code. Please retry.",
                    "loading": "Loading",
                    "security.passkeys.creation": "Passkey Creation",
                    "apps-and-services.access-date": "Access given on",
                    "apps-and-services.description": "Key privacy options that help you choose what data is stored in your account, what information you share with others and more",
                    "security.otp-authenticators.multiple-added": "{{numberOfDevices}} {{deviceTitle}}",
                    "security.description": "Settings and recommendations to protect the account",
                    "account.action": "Action",
                    "security.password.title": "Password",
                    "security.multi-factor-authentication.active-methods": "Active Authentication methods",
                    "error.security.multi-factor-authentication.setup-start": "Failed to start MFA setup for account.",
                    "linked-accounts.title": "Linked Accounts",
                    "error.security.multi-factor-authentication.add-factor": "Failed to add MFA factor to account.",
                    "confirm-proceed": "Are you sure you want to proceed with this action?",
                    "security.no-phone-added": "No phone numbers added yet",
                    "sign-in": "Sign In",
                    "sign-out": "Sign Out",
                    "account.address.add-new-address": "Add New Address",
                    "account.description": "Manage your data, privacy and security to get the most out of Curity",
                    "error.security.multi-factor-authentication.setup-complete": "Failed to complete MFA setup for account.",
                    "save": "Save",
                    "account.verify": "Verify",
                    "security.passkeys.keys": "keys",
                    "verifying-code": "Verifying Code",
                    "account.phone.check": "Check your phone",
                    "account.change": "Change",
                    "account.make-primary": "Make primary",
                    "error.account.fetch-all": "Failed to retrieve accounts.",
                    "session.title": "Sessions",
                    "security.multi-factor-authentication.not-used": "Not used for MFA",
                    "security.multi-factor-authentication.replace": "Replace",
                    "security.password.passwords-must-match": "Passwords must match",
                    "error.account.email.delete": "Failed to delete email address.",
                    "account.phone.verification-success": "Your new phone number has been successfully verified",
                    "security.otp-authenticators.single-added": "1 {{deviceTitle}}",
                    "account.address.description": "Easily manage your addresses. Add a new address, update details, or remove ones you no longer use.",
                    "security.multi-factor-authentication.not-used-no-optin-warning": "Multi-factor Authentication (MFA) is currently not used for your account. Your account is not fully protected! Use MFA to keep your account safe from unauthorized access.",
                    "error.security.passkeys.verify": "Failed to verify passkey.",
                    "error.account.fetch-unsorted": "Failed to retrieve unsorted accounts.",
                    "security.multi-factor-authentication.used": "Used for MFA",
                    "toggle-sidebar-navigation": "Toggle sidebar navigation",
                    "security.passkeys.page-title": "Security / Passkeys",
                    "security.multi-factor-authentication.enabled-message": "Multi-factor authentication is enabled. Your account is protected with an additional layer of security",
                    "account.profile-details": "Profile details",
                    "account.email.title": "Email addresses",
                    "security.multi-factor-authentication.description": "Multi factor Authentication allows the user to add second factors to protect their account. The first time the user hits the action they will be presented with the option to add a second factor. Once added, the user must always login with two factors.",
                    "account.first-name": "First Name",
                    "page-not-found-404": "404 Page Not Found",
                    "account.address": "Address",
                    "account.phone.title": "Phone number",
                    "account.phone.add-new": "+ New phone",
                    "create": "Create",
                    "no-title-available": "No {{title}} Available",
                    "new": "New",
                    "error.security.multi-factor-authentication.delete-factor": "Failed to delete MFA factor from account.",
                    "delete-row": "delete row",
                    "delete-item": "delete item",
                    "linked-accounts.foreign-account-domain": "Foreign Account Domain",
                    "please-wait": "Please wait",
                    "error.security.otp-authenticators.complete-totp": "Failed to complete OTP authenticator verification. Please try again.",
                    "done": "Done",
                    "security.password.set-new-password": "Set new password",
                    "header": "Header",
                    "error.security.otp-authenticators.start-totp": "Failed to start OTP verification. Please retry.",
                    "error.account.fetch-by-id": "Failed to retrieve account by ID.",
                    "error.security.otp-authenticators.add": "Failed to add device to account.",
                    "security.multi-factor-authentication.replaced-success": "Recovery codes replaced successfully",
                    "return-to-home": "Return to Home",
                    "apps-and-services.title": "Apps and Services",
                    "account.address.enter-details": "Enter the details for your new address",
                    "apps-and-services.shared-data": "You share data with these apps and services",
                    "security.multi-factor-authentication.reset": "Reset Multi Factor Authentication",
                    "reload": "Reload",
                    "security.multi-factor-authentication.reset-heading": "Reset",
                    "security.multi-factor-authentication.disable": "disable",
                    "security.multi-factor-authentication.reset-short": "Reset MFA",
                    "alias": "Alias",
                    "account.phone.send-code": "We\u0027ll send a verification code to this phone number",
                    "error.account.email.update-primary": "Failed to update primary email address.",
                    "security.otp-authenticators.new-otp": "New OTP Authenticator",
                    "error.load": "Failed to load",
                    "error.security.multi-factor-authentication.reset-state": "Failed to reset MFA state. Please retry.",
                    "security.passkeys.description": "With passkeys, you can securely sign in to your Account using just your fingerprint, face, screen lock, or security key. Passkeys and security keys can also be used as a second step when signing in with your password. Be sure to keep your screen locks private and security keys safe, so only you can use them.",
                    "account.address.region.placeholder": "State/Province",
                    "security.multi-factor-authentication.not-protected": "Your account is not fully protected! Use MFA to keep your account safe from unauthorized access.",
                    "account.sending-code": "Sending verification code...",
                    "security.multi-factor-authentication.reset-warning-extended": "Resetting Multi-factor Authentication will remove all your current authentication methods. You can set up MFA again at your next login. This may leave your account less secure.",
                    "session.session-id": "Session id",
                    "error.security.multi-factor-authentication.opt-out": "Failed to opt out from MFA for account.",
                    "error.account.email.complete-verification": "Failed to complete email verification. Please try again.",
                    "account.last-name": "Last Name",
                    "welcome-message": "Welcome to the User Self Service Portal!",
                    "security.otp-authenticators.description": "TOTP is suitable as a second factor during authentication, and usually less suitable as a standalone single factor, as it relies on the device only, which may not be protected by any passwords or pin codes",
                    "account.email.verified-success": "Your email address has been successfully verified",
                    "account.address.country": "Country"
                },
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