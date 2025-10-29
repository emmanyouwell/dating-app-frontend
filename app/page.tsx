
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import { TextParallaxScroll } from '@/components/hover/TextParallaxScroll';
export default function Home() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className='flex min-h-screen items-center justify-center bg-background font-sans dark:bg-background'>
        <main className='flex min-h-screen w-full max-w-7xl flex-col items-center bg-background dark:bg-background sm:items-start p-4'>
          <section className='flex flex-col md:flex-row items-center justify-between gap-4 w-full bg-background md:px-3'>
            <div className='h-full w-full rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4 bg-white py-8 lg:py-0 md:px-8'>
              <div className='flex flex-col items-center lg:items-start w-full space-y-4'>
                <Typography
                  variant='h1'
                  className='w-full text-pink-950 text-center lg:text-left'
                >
                  Meet people who actually{' '}
                  <span className='font-extrabold text-accent italic'>get</span>{' '}
                  you
                </Typography>
                <Typography
                  variant='p'
                  className='text-pink-950 text-center lg:text-left'
                >
                  {' '}
                  You bring the vibe — we&apos;ll bring the connections. Create
                  your profile, start exploring, and see who&apos;s waiting on
                  the other side of the swipe.
                </Typography>
                <div className='flex items-center gap-4'>
                  <Button size='lg' className='text-white'>
                    Start Matching
                  </Button>
                  <Button size='lg' variant="outline" className='text-accent bg-transparent border-accent'>
                    Explore how it works
                  </Button>
                </div>
              </div>

              <div className='lg:w-[33vw]'>
                <Image
                  src='/assets/images/girl-1-transparent.png'
                  width={336}
                  height={500}
                  priority
                  alt='girl 1 image'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 336px'
                />
              </div>
            </div>
          </section>
          <section className='w-full py-4 bg-background'>
            <TextParallaxScroll />
          </section>
          <section className='flex flex-col md:flex-row items-center justify-between gap-4 w-full bg-background md:px-3'>
            <div className='h-full w-full rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4 bg-white py-8 lg:py-0 md:px-8'>
              <div className='flex flex-col items-center lg:items-start w-full space-y-4'>
                <Typography
                  variant='h1'
                  className='w-full text-pink-950 text-center lg:text-left'
                >
                  Meet people who actually{' '}
                  <span className='font-extrabold text-accent italic'>get</span>{' '}
                  you
                </Typography>
                <Typography
                  variant='p'
                  className='text-pink-950 text-center lg:text-left'
                >
                  {' '}
                  You bring the vibe — we&apos;ll bring the connections. Create
                  your profile, start exploring, and see who&apos;s waiting on
                  the other side of the swipe.
                </Typography>
                <div className='flex items-center gap-4'>
                  <Button size='lg' className='text-white'>
                    Build my profile
                  </Button>
                  <Button size='lg' className='text-white bg-accent'>
                    Start matching
                  </Button>
                </div>
              </div>

              <div className='lg:w-[33vw]'>
                <Image
                  src='/assets/images/girl-1-transparent.png'
                  width={336}
                  height={500}
                  priority
                  alt='girl 1 image'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 336px'
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
