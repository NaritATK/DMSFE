import Login from '@views/Login'

import { buildGuestAuthMetadata, renderGuestAuthPage } from '../_utils/guest-auth-page'

export const metadata = buildGuestAuthMetadata({
  title: 'Login',
  description: 'Login to your account',
})

export default async function LoginPage() {
  return renderGuestAuthPage(Login)
}
