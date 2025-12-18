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

const gaEndpoint = graphql.link('http://localhost/granted-authorization/graphql')
const payload = {
    "edges": [
        {
            "node": {
                "owner": "testuser",
                "authorizedClient": {
                    "id": "test-client",
                    "name": "Test Client",
                    "description": "This is a test client",
                    "logoUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjE0LjA3IiBkPSJNOTUuMzggMTc1SDY2LjI2Yy04LjU5IDAtMTUuNjItNy4wMy0xNS42Mi0xNS42MlY2NS42N2MwLTguNTkgNy4wMy0xNS42MiAxNS42Mi0xNS42MmgxMjQuOTVjOC41OSAwIDE1LjYyIDcuMDMgMTUuNjIgMTUuNjIiPjwvcGF0aD48Y2lyY2xlIGZpbGw9ImN1cnJlbnRDb2xvciIgY3g9IjgwLjI0IiBjeT0iNzkuODgiIHI9IjguMDciPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0iY3VycmVudENvbG9yIiBjeD0iMTA5LjEyIiBjeT0iNzkuODgiIHI9IjguMDciPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0iY3VycmVudENvbG9yIiBjeD0iMTM4LjAxIiBjeT0iNzkuODgiIHI9IjguMDciPjwvY2lyY2xlPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iOC4xNSIgZD0ibTE4Ni43NCAxMzEuMy0xNC42OSAxLjlNMTM1Ljc5IDEyMC4wMWwtMTAuMDQtMTIuNjZNMTI3LjAxIDE0MC4ybC0xNC41OCAyLjY1TTE2My4yNyAxMDEuNTFsLTUuNzIgMTUuMTFNMjIwLjY2IDE3OC43N2MzLjc3IDE4LjYtOC4yNCAzNi43My0yNi44NCA0MC41TTIwMS4yNiAxNjkuNTZsLS44NS00LjIxYy0uOTQtNC42NS01LjQ4LTcuNjUtMTAuMTMtNi43MXMtNy42NSA1LjQ4LTYuNzEgMTAuMTMiPjwvcGF0aD48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjguMTUiIGQ9Im0xODMuNTcgMTY4Ljc3LS44NS00LjIxYy0uOTQtNC42NS01LjQ4LTcuNjUtMTAuMTMtNi43MXMtNy42NSA1LjQ4LTYuNzEgMTAuMTNsLjg1IDQuMjEiPjwvcGF0aD48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjguMTUiIGQ9Im0xNjYuMzEgMTcwLjA4LTQuNy0yMy4xNWMtLjk0LTQuNjUtNS40OC03LjY1LTEwLjEzLTYuNzFzLTcuNjUgNS40OC02LjcxIDEwLjEzbDguNTQgNDIuMDkiPjwvcGF0aD48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjguMTUiIGQ9Ik0yMDEuMjYgMTY5LjU2Yy0uOTQtNC42NSAyLjA2LTkuMTggNi43MS0xMC4xM3M5LjE4IDIuMDYgMTAuMTMgNi43MWwyLjU2IDEyLjYzYzMuNzcgMTguNi04LjI0IDM2LjczLTI2Ljg0IDQwLjVsLTguNDIgMS43MWMtMTEuNzggMi4zOS0xOS42Ny4yMi0yNy4yMS00LjczbC0xOC4yMy0xMi4wOGMtMy44Mi0yLjgyLTQuNjItOC4yLTEuODEtMTIuMDFhOC41ODMgOC41ODMgMCAwIDEgMTEuMzEtMi4yN2w4LjkxIDUuOSI+PC9wYXRoPjwvc3ZnPgo=",
                    "__typename": "AuthorizedOAuthClient"
                },
                "authorizedScopes": [
                    {
                        "name": "openid",
                        "localizedName": "openid",
                        "description": "OpenId Connect",
                        "__typename": "AuthorizedScope"
                    },
                    {
                        "name": "read",
                        "localizedName": "read",
                        "description": "Read access",
                        "__typename": "AuthorizedScope"
                    }
                ],
                "authorizedClaims": [
                    {
                        "name": "account_id",
                        "localizedName": "account_id",
                        "description": "Account Identifier",
                        "__typename": "AuthorizedClaim"
                    }
                ],
                "meta": {
                    "created": 1763623267,
                    "lastModified": 1763634740,
                    "__typename": "Meta"
                },
                "__typename": "GrantedAuthorization"
            },
            "__typename": "GrantedAuthorizationEdge"
        }
    ],
    "pageInfo": {
        "endCursor": null,
        "hasNextPage": false,
        "__typename": "PageInfo"
    },
    "totalCount": 1,
    "warnings": null,
    "__typename": "GrantedAuthorizationConnection"
};

export const ga = [
    gaEndpoint.query('getGrantedAuthorizationsByOwner', () => {
        return HttpResponse.json({
            "data": {
                "grantedAuthorizationsByOwner": payload
            }
        })
    }),

    gaEndpoint.query('getGrantedAuthorizationsByOwnerAndClient' , () => {
        return HttpResponse.json({
            "data": {
                "grantedAuthorizationsByOwnerAndClient": payload
            }
        })
    }),

    gaEndpoint.mutation('revokeGrantedAuthorizationsByOwnerAndClient', () => {
        return HttpResponse.json({
            "data": {
                "revokeGrantedAuthorizationsByOwnerAndClient": {
                    "success": true,
                    "asynchronous": false,
                    "__typename": "RevokeGrantedAuthorizationPayload"
                }
            }
        })
    })
]