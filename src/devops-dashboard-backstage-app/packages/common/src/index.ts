/**
 * Backstage auth-provider id for the Curity sign-in.
 *
 * `curity` is the devops-dashboard plugin's contractual name for the
 * provider — its auth API dials /api/auth/curity/* — so the backend must
 * register under exactly this id. Also matches the `auth.providers.curity`
 * key in app-config.yaml. A mismatch surfaces as 404s on
 * /api/auth/curity/start.
 */
export const CURITY_AUTH_PROVIDER_ID = 'curity';
