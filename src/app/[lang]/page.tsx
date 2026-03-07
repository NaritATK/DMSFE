import { redirect } from 'next/navigation'

export default async function RootPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  redirect(`/${lang}/chat`)
}
