import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/providers/ClientProvider';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Modern Dating App | Meet Real People, Build Real Connections',
  description:
    'Discover a modern dating experience designed to help you meet authentic people nearby. Chat, match, and find real connections that go beyond the surface.',
  keywords: [
    'modern dating app',
    'find real connections',
    'chat and match',
    'meet singles nearby',
    'dating platform',
    'relationship app',
    'new people',
    'real dating experience',
  ],
  authors: [{ name: 'Modern Dating App' }],
  openGraph: {
    title: 'Modern Dating App - Where Real Connections Begin',
    description:
      'Join a modern dating platform built for meaningful conversations and genuine matches. Your next connection is just one swipe away.',
    url: 'https://dating.emmandev.site',
    siteName: 'Modern Dating App',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/images/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern Dating App preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Dating App | Real Connections, Real People',
    description:
      'Experience dating that actually feels modern. Meet people who match your vibe and values.',
    images: ['/assets/images/opengraph-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  themeColor: '#ff3366',
  alternates: {
    canonical: 'https://dating.emmandev.site',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <Script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-W4KDFL6PPE'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {` window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-W4KDFL6PPE');`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
