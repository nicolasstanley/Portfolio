import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sarah Johnson - UX Designer Portfolio',
  description: 'Senior UX Designer & Design Systems Specialist with 5+ years of experience creating user-centered digital experiences.',
  keywords: 'UX Designer, Design Systems, User Experience, Portfolio, UI Design, User Research',
  authors: [{ name: 'Sarah Johnson' }],
  openGraph: {
    title: 'Sarah Johnson - UX Designer Portfolio',
    description: 'Senior UX Designer & Design Systems Specialist with 5+ years of experience creating user-centered digital experiences.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Access environment variable on server side
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {children}
        {/* Pass bucket slug as prop to client component */}
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}