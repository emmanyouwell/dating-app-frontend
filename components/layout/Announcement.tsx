'use client';
import Link from 'next/link';
import { useState } from 'react';

export const Announcement = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className='fixed top-0 left-0 w-full bg-primary text-primary-foreground flex items-center justify-center px-4 py-2 shadow-md z-50 '>
      <div className='relative w-full text-center'>
        <p className='text-sm sm:text-base font-medium'>
          My backend runs on <Link href="https://render.com/" className="text-background underline hover:text-pink-950 transition-all">Render's Starter Instance</Link>. Some requests may take a little
          longer—if that happens, just refresh the page!
        </p>
        <button
          onClick={() => setVisible(false)}
          className='ml-4 text-primary-foreground hover:text-gray-700 font-bold absolute right-0 top-0'
          aria-label='Dismiss'
        >
          ✕
        </button>
      </div>
    </div>
  );
};
