'use client';
import React, { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';

export const TextParallaxScroll = () => {
  return (
    <div className='bg-background dark:bg-background'>
      <TextParallaxContent
        imgUrl='https://images.unsplash.com/photo-1747184046952-8890127c598a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627'
        subheading='Personalized Preferences'
        heading='Your Type. Your Rules.'
      >
        <PreferenceContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl='https://images.unsplash.com/photo-1708932829149-a88fec7ff267?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
        subheading='Smart Matchmaking'
        heading='Real People. Real Vibes.'
      >
        <MatchContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl='https://images.unsplash.com/photo-1699531683515-d9c19d9cf9c6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880'
        subheading='Mutual Chat'
        heading='Mutual Likes. Meaningful Talks.'
      >
        <ChatContent />
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: ReactNode;
}) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className='relative h-[150vh]'>
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }: { imgUrl: string }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className='sticky z-0 overflow-hidden rounded-3xl dark:brightness-[0.7] dark:contrast-[0.9]'
    >
      <motion.div
        className='absolute inset-0 bg-neutral-950/70 dark:bg-black/60'
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({
  subheading,
  heading,
}: {
  subheading: string;
  heading: string;
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className='absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white dark:text-gray-100'
    >
      <p className='mb-2 text-center text-xl md:mb-4 md:text-3xl'>
        {subheading}
      </p>
      <p className='text-center text-4xl font-bold md:text-7xl'>{heading}</p>
    </motion.div>
  );
};

const PreferenceContent = () => (
  <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12'>
    <h2 className='col-span-1 text-3xl font-bold md:col-span-4 dark:text-white'>
      Personalized Preference.
    </h2>
    <div className='col-span-1 md:col-span-8'>
      <p className='mb-4 text-xl text-neutral-600 dark:text-neutral-300 md:text-2xl'>
        Every choice — from age and distance to gender and interests — sharpens
        your matches. The more you personalize, the closer you get to someone
        who truly clicks with you.
      </p>
      <p className='mb-8 text-xl text-neutral-600 dark:text-neutral-300 md:text-2xl'>
        Set your profile and preferences to make the app truly yours. Your
        choices tailor match suggestions so you meet people who fit your vibe.
      </p>
      <button className='w-full rounded bg-neutral-900 dark:bg-neutral-100 px-9 py-4 text-xl text-white dark:text-neutral-900 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-200 md:w-fit'>
        <Link href='/profile'>
          Complete My Profile <FiArrowUpRight className='inline' />
        </Link>
      </button>
    </div>
  </div>
);

const MatchContent = () => (
  <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12'>
    <h2 className='col-span-1 text-3xl font-bold md:col-span-4 dark:text-white'>
      Smart Matchmaking.
    </h2>
    <div className='col-span-1 md:col-span-8'>
      <p className='mb-4 text-xl text-neutral-600 dark:text-neutral-300 md:text-2xl'>
        Browse candidates based on your preferences and choose who to “Like” or
        “Skip.” Every choice brings you closer to meaningful connections.
      </p>
      <p className='mb-8 text-xl text-neutral-600 dark:text-neutral-300 md:text-2xl'>
        Unmatch or remove previous connections anytime to keep your list fresh.
        Stay in control of your matches and your dating journey.
      </p>
      <button className='w-full rounded bg-neutral-900 dark:bg-neutral-100 px-9 py-4 text-xl text-white dark:text-neutral-900 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-200 md:w-fit'>
        <Link href='/match'>
          Start Matchmaking <FiArrowUpRight className='inline' />
        </Link>
      </button>
    </div>
  </div>
);

const ChatContent = () => (
  <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12'>
    <h2 className='col-span-1 text-3xl font-bold md:col-span-4 dark:text-white'>
      Real-time Chat.
    </h2>
    <div className='col-span-1 md:col-span-8'>
      <p className='mb-4 text-xl text-neutral-600 dark:text-neutral-300 md:text-2xl'>
        Mutual matches unlock real-time chats so you can start conversations
        instantly. Connect with people who genuinely like you and keep the spark
        alive.
      </p>
      <p className='mb-8 text-xl text-neutral-600 dark:text-neutral-300 md:text-2xl'>
        You can remove chat access anytime by unmatching a user. Stay in control
        of your conversations and your connections.
      </p>
      <button className='w-full rounded bg-neutral-900 dark:bg-neutral-100 px-9 py-4 text-xl text-white dark:text-neutral-900 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-200 md:w-fit'>
        <Link href='/profile'>
          Check Conversations <FiArrowUpRight className='inline' />
        </Link>
      </button>
    </div>
  </div>
);
