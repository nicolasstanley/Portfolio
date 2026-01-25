import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiter: max 5 notifications per minute (prevents spam)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'ratelimit:visitor-alerts',
})

// Country code to name mapping for common countries
const countryNames: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', FR: 'France', DE: 'Germany',
  ES: 'Spain', IT: 'Italy', NL: 'Netherlands', BE: 'Belgium', CH: 'Switzerland',
  CA: 'Canada', AU: 'Australia', JP: 'Japan', CN: 'China', IN: 'India',
  BR: 'Brazil', MX: 'Mexico', AR: 'Argentina', SE: 'Sweden', NO: 'Norway',
  DK: 'Denmark', FI: 'Finland', PL: 'Poland', PT: 'Portugal', IE: 'Ireland',
  AT: 'Austria', CZ: 'Czech Republic', RU: 'Russia', KR: 'South Korea',
  SG: 'Singapore', HK: 'Hong Kong', NZ: 'New Zealand', ZA: 'South Africa',
}

// Send push notification via Pushover
async function sendPushoverNotification(country: string | null) {
  const countryName = country
    ? (countryNames[country] || country)
    : 'Unknown location'

  try {
    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: process.env.PUSHOVER_APP_TOKEN,
        user: process.env.PUSHOVER_USER_KEY,
        title: 'Portfolio',
        message: `New visitor from ${countryName}`,
        priority: 0,
        sound: 'pushover',
      }),
    })

    if (!response.ok) {
      console.error('Pushover API error:', await response.text())
    }
  } catch (error) {
    console.error('Failed to send Pushover notification:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract IP address from Vercel headers
    const ip =
      request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Skip tracking for unknown IPs or localhost
    if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
      return NextResponse.json({ success: true, reason: 'skipped' })
    }

    // Check if this IP has been seen in the last 30 days
    const visitorKey = `visitor:${ip}`
    const seen = await redis.get(visitorKey)

    if (seen) {
      // Already seen this visitor, no notification needed
      return NextResponse.json({ success: true, reason: 'returning' })
    }

    // Get country from Vercel geolocation headers
    const country = request.headers.get('x-vercel-ip-country')

    // Check rate limit before sending notification
    const { success: withinLimit } = await ratelimit.limit('global')

    if (withinLimit) {
      // New visitor! Send notification
      await sendPushoverNotification(country)
    } else {
      console.log('Rate limit exceeded, skipping notification for:', ip)
    }

    // Mark this IP as seen (30 days TTL = 2592000 seconds)
    await redis.set(visitorKey, '1', { ex: 2592000 })

    return NextResponse.json({ success: true, reason: 'new' })
  } catch (error) {
    // Log error but always return success to not affect visitor experience
    console.error('Visitor tracking error:', error)
    return NextResponse.json({ success: true, reason: 'error' })
  }
}

// Also handle GET requests (just return success, no tracking)
export async function GET() {
  return NextResponse.json({ success: true, message: 'Visitor tracking endpoint' })
}
