'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface GoogleAnalyticsProps {
  trackingId: string
}

export function GoogleAnalytics({ trackingId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Track page views
    const handleRouteChange = (url: string) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', trackingId, {
          page_path: url,
        })
      }
    }

    // Listen for route changes (if using client-side navigation)
    const handleLocationChange = () => {
      handleRouteChange(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [trackingId])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

// Custom event tracking for conversions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', 'engagement', formName)
}

// Track downloads
export const trackDownload = (fileName: string) => {
  trackEvent('download', 'engagement', fileName)
}

// Track contact interactions
export const trackContact = (method: 'phone' | 'email' | 'whatsapp' | 'form') => {
  trackEvent('contact', 'lead_generation', method)
}