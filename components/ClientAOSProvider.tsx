'use client'

import dynamic from 'next/dynamic'

const AOSProvider = dynamic(() => import('@/components/AOSProvider'), {
  ssr: false
})

export default function ClientAOSProvider({ children }: { children: React.ReactNode }) {
  return <AOSProvider>{children}</AOSProvider>
}