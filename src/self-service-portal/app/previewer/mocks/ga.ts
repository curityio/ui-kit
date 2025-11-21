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

export const ga = [
    gaEndpoint.query('getGrantedAuthorizationsByOwner', () => {
        return HttpResponse.json({
            "data": {
                "grantedAuthorizationsByOwner": {
                    "edges": [
                        {
                            "node": {
                                "owner": "testuser",
                                "authorizedClient": {
                                    "id": "self-service-portal-app-client",
                                    "name": null,
                                    "description": null,
                                    "logoUri": null,
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
                                        "name": "ussp",
                                        "localizedName": "ussp",
                                        "description": "",
                                        "__typename": "AuthorizedScope"
                                    }
                                ],
                                "authorizedClaims": [
                                    {
                                        "name": "account_id",
                                        "localizedName": "account_id",
                                        "description": "",
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
                }
            }
        })
    }),

    gaEndpoint.query('getGrantedAuthorizationsByOwnerAndClient' , () => {
        return HttpResponse.json({
            "data": {
            "grantedAuthorizationsByOwnerAndClient": {
                "edges": [
                    {
                        "node": {
                            "owner": "testuser",
                            "authorizedClient": {
                                "id": "self-service-portal-app-client",
                                "name": null,
                                "description": null,
                                "logoUri": null,
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
                                    "name": "ussp",
                                    "localizedName": "ussp",
                                    "description": "",
                                    "__typename": "AuthorizedScope"
                                }
                            ],
                            "authorizedClaims": [
                                {
                                    "name": "account_id",
                                    "localizedName": "account_id",
                                    "description": "",
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
            }
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