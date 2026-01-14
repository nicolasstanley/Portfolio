import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import { getAboutMe } from '@/lib/cosmic'
import SolanaPulseViz from '@/components/SolanaPulseViz'

export const metadata: Metadata = {
  title: 'Solana Transactions Pulse - Nicolas Ménard',
  description: 'A real-time visualization of Solana blockchain transactions',
}

export default async function SolanaTransactionsPulsePage() {
  const aboutMe = await getAboutMe().catch(() => null)

  return (
    <div className="min-h-screen">
      <Navigation aboutMe={aboutMe} />
      <SolanaPulseViz />
    </div>
  )
}
