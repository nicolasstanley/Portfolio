import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import ClientAOSProvider from '@/components/ClientAOSProvider'
import './globals.css'

export const viewport = 'width=device-width, initial-scale=1'

export const metadata: Metadata = {
  title: 'Nicolas Ménard - UX Designer & Researcher',
  description: 'UX Designer & Researcher with 10 years of experience in User Experience creating user-centered digital experiences.',
  keywords: 'UX Designer, Design Systems, User Experience, Portfolio, UI Design, User Research',
  authors: [{ name: 'Nicolas Ménard' }],
  openGraph: {
    title: 'Nicolas Ménard - UX Designer & Researcher',
    description: 'UX Designer & Researcher with 10+ years of experience creating user-centered digital experiences.',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dk6j5aucm/image/upload/v1758400312/meta_lrcned.png',
        width: 1200,
        height: 630,
        alt: 'Nicolas Ménard - UX Designer & Researcher Portfolio',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <ClientAOSProvider>
          {children}
        </ClientAOSProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}