'use client';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import { TextParallaxScroll } from '@/components/hover/TextParallaxScroll';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Announcement } from '@/components/layout/Announcement';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      
      <Navbar isAuthenticated={isAuthenticated} loading={loading} />

      <div className="flex min-h-screen items-center justify-center bg-background font-sans">
        <main className="flex min-h-screen w-full max-w-7xl flex-col items-center sm:items-start p-4">
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-4 w-full md:px-3">
            <div className="h-full w-full rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4 bg-card text-sidebar-accent-foreground py-8 lg:py-0 md:px-8 shadow-sm">
              <div className="flex flex-col items-center lg:items-start w-full space-y-4">
                <Typography
                  variant="h1"
                  className="w-full text-center lg:text-left"
                >
                  Meet people who actually{' '}
                  <span className="font-extrabold text-accent italic">get</span>{' '}
                  you
                </Typography>

                <Typography
                  variant="p"
                  className="text-center lg:text-left text-muted-foreground"
                >
                  You bring the vibe — we&apos;ll bring the connections. Create
                  your profile, start exploring, and see who&apos;s waiting on
                  the other side of the swipe.
                </Typography>

                <div className="flex items-center gap-4">
                  <Button size="lg">
                    <Link href="/match">Start Matching</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Link href="/chat">Chat now</Link>
                  </Button>
                </div>
              </div>

              <div className="lg:w-[33vw]">
                <Image
                  src="/assets/images/girl-1-transparent.png"
                  width={336}
                  height={500}
                  priority
                  alt="girl 1 image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 336px"
                />
              </div>
            </div>
          </section>

          {/* Text Parallax Section */}
          <section className="w-full py-4 bg-background">
            <TextParallaxScroll />
          </section>

          {/* Feedback Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-4 w-full md:px-3">
            <div className="h-full w-full rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4 bg-card text-card-foreground py-8 lg:py-0 md:px-8 shadow-sm">
              <div className="flex flex-col items-center lg:items-start w-full space-y-4">
                <Typography
                  variant="h1"
                  className="w-full text-center lg:text-left"
                >
                  Help Me Make This App Awesome!
                </Typography>

                <Typography
                  variant="p"
                  className="text-center lg:text-left text-muted-foreground"
                >
                  Your thoughts, bugs, and ideas mean a lot. Every message helps
                  me make the app smoother and more fun for everyone.
                </Typography>

                <div className="flex items-center gap-4">
                  <a
                    href="mailto:emingala02@gmail.com?subject=Feedback%20on%20Your%20App&body=Hi%2C%0A%0AI%20have%20some%20feedback%3A"
                    className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg text-lg hover:bg-primary/90 transition-colors"
                  >
                    Share feedback
                  </a>
                </div>
              </div>

              <div className="lg:w-[33vw] py-8">
                <Image
                  src="/assets/images/high-five.png"
                  width={308}
                  height={400}
                  priority
                  alt="high five image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 336px"
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="w-full flex items-center justify-center h-12">
            <Typography variant="small" className="text-muted-foreground">
              Made with 💚 by someone who cares for connection
            </Typography>
          </div>
        </main>
      </div>
    </>
  );
}
