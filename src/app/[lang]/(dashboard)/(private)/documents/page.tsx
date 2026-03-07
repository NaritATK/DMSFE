import { redirect } from 'next/navigation'

type DocumentsRedirectProps = {
  params: Promise<{ lang: string }>
}

// Redirect /[lang]/documents to /[lang]/history
// The documents page has been removed and consolidated with history page
export default async function DocumentsRedirect({ params }: DocumentsRedirectProps) {
  const { lang } = await params

  redirect(`/${lang}/history`)
}
