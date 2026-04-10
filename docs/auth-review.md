# Auth flow code review (login/signup + route protection)

## Symptoms mapped to likely failure points

1. **"Logged in user gets pushed back to login on saved pages"**
   - Root cause: frontend refresh logic skipped *all* `/auth/*` endpoints. That includes `/auth/me` and `/auth/saved-crops`, which are protected routes and should be retried after refresh.
   - Effect: if access token expires (15 min), calling `/auth/saved-crops` fails with 401 and never refreshes session.

2. **"Sometimes I can see all pages without login"**
   - Likely scenario A: user still has valid HttpOnly cookies from previous session, so they are already authenticated even if UI looks like a fresh visit.
   - Likely scenario B: logout did not reliably clear cookies in some environments because `clearCookie` options did not match set-cookie options.

3. **Intermittent behavior after token expiry with multiple requests**
   - Root cause: only one refresh could run; parallel requests during refresh immediately failed as Unauthorized.
   - Effect: random redirects or mixed success/failure depending on request timing.

## Additional risks identified (not changed in this patch)

- CORS currently accepts any origin while allowing credentials, which is unsafe and can produce hard-to-debug cross-origin cookie behavior.
- Login/register UI error handling expects Axios-style errors (`err.response`) but API utility throws plain `Error`.

## Scenarios to test manually

1. Login, wait > 15 minutes, then open `/saved-crops`.
   - Expected: silent refresh and page loads.
2. Open two protected tabs simultaneously right after access token expiry.
   - Expected: one refresh, both requests recover.
3. Logout then refresh browser and revisit `/profile`.
   - Expected: redirect to `/login`.
4. Clear cookies, visit `/saved-crops` directly.
   - Expected: redirect to `/login`.
5. Login from one tab, logout from another tab, then access protected route in first tab.
   - Expected: forced re-authentication.
