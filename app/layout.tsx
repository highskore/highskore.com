import './globals.css'
import Providers from './providers'
import { cn } from '@/lib/className'
import AnimateEnter from '@/ui/AnimateEnter'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  authors: [{ name: 'highskore', url: 'https://highskore.com' }],
  category: 'blockchain',
  creator: 'highskore',
  description: 'a smart contract developer portfolio',
  icons: {
    apple: '/static/favicons/apple-touch-icon-180x180.png',
    icon: '/static/favicons/favicon-196x196.png',
    shortcut: '/favicon.ico',
  },
  keywords: [
    'Next.js',
    'React',
    'JavaScript',
    'TypeScript',
    'Solidity',
    'Web3',
    'Ethereum',
    'Blockchain',
    'Design',
    'Engineering',
    'Developer',
  ],
  manifest: '/static/favicons/site.webmanifest',
  openGraph: {
    description: 'a smart contract developer portfolio',
    images: [
      {
        alt: 'highskore',
        height: 1080,
        url: 'https://highskore.com/static/images/og.png',
        width: 1920,
      },
    ],
    locale: 'en-US',
    siteName: 'highskore',
    title: 'highskore',
    type: 'website',
    url: 'https://highskore.com',
  },
  publisher: 'highskore',
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  title: {
    default: 'highskore',
    template: '%s | highskore',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@0xhighskore',
    title: 'highskore',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          `${inter.className}`,
          'h-full, min-h-screen, relative w-full',
          'mb-4 pt-4 bg-light-gray sm:mb-24 sm:pt-28',
          'motion-reduce:transform-none motion-reduce:transition-none'
        )}
      >
        <Providers>
          <div className='mx-auto max-w-2xl px-4 sm:px-8'>
            <>{children}</>
          </div>
        </Providers>
      </body>
    </html>
  )
}
