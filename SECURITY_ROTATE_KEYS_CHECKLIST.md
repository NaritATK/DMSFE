# SECURITY_ROTATE_KEYS_CHECKLIST

## Scope
This checklist is for rotating credentials that were present in local env/template files.

## 1) Rotate immediately
- [ ] `AZURE_AD_CLIENT_SECRET`
- [ ] `GOOGLE_CLIENT_SECRET` (if still used)
- [ ] `NEXTAUTH_SECRET`
- [ ] Supabase keys currently in examples (`NEXT_PUBLIC_SUPABASE_*`)

## 2) Update secret stores
- [ ] Update local `.env` with new values
- [ ] Update production/staging secret manager (Vercel/host env)
- [ ] Remove old values from CI/CD variables

## 3) Invalidate old credentials
- [ ] Disable old Azure AD client secret
- [ ] Disable old Google OAuth secret
- [ ] Regenerate session secret used by NextAuth
- [ ] Rotate Supabase keys and disable old key set

## 4) Verify app health after rotation
- [ ] Login works (Azure AD)
- [ ] `/api/auth/session` returns valid session
- [ ] Upload flow works (`/en/upload` -> `/api/documents/upload`)
- [ ] FE proxy routes still authorize with backend token

## 5) Repository hygiene
- [ ] Keep `.env` untracked
- [ ] Keep templates secret-free (`.env.example`, `.env.example.old`)
- [ ] If secrets were ever committed, rewrite history and force rotate all exposed keys

## Notes
- Public keys (`NEXT_PUBLIC_*`) are still sensitive in abuse scenarios; rotate if previously exposed unexpectedly.
- Rotation is only complete after old credentials are revoked.
