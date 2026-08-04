/**
 * Backstage auth-provider id for the Curity sign-in.
 *
 * Used by the frontend (OAuth2 client + SignInPage) and the backend
 * (provider registration); the route /api/auth/<id>/start is derived from
 * it. Must also match the `auth.providers.oidc` key in app-config.yaml —
 * YAML cannot import this constant, so that one stays in sync manually.
 * A mismatch surfaces as 404s on /api/auth/<id>/start.
 */
export const CURITY_AUTH_PROVIDER_ID = 'oidc';
