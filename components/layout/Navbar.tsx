'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconType } from 'react-icons';
import Link from 'next/link';
import {
  FiMenu,
  FiHome,
  FiX,
  FiMessageCircle,
  FiHeart,
  FiLogOut,
  FiLogIn,
} from 'react-icons/fi';
import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Loader, Moon, Sun } from 'lucide-react';
import { clearChat } from '@/store/slices/chatSlice';
import { useSocket } from '@/context/SocketContext';
import { useTheme } from 'next-themes';

const Navbar = ({
  isAuthenticated,
  loading,
}: {
  isAuthenticated: boolean;
  loading: boolean;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { socket } = useSocket();
  const { theme, setTheme } = useTheme();
  const handleLogout = () => {
    dispatch(logoutUser()).unwrap();
    dispatch(clearChat());

    if (socket) socket.disconnect();
    router.push('/login');
  };
  return (
    <motion.nav
      animate={open ? 'open' : 'closed'}
      initial='closed'
      className='z-1000 bg-white rounded-md text-black shadow-lg flex items-center justify-between fixed bottom-8 left-[50%] -translate-x-[50%]'
    >
      <MenuButton setOpen={setOpen} open={open} />
      <div className='flex gap-6 px-6'>
        <NavLink text='Home' Icon={FiHome} href='/' />
        <NavLink text='Match' Icon={FiHeart} href='/match' />
        <NavLink text='Chat' Icon={FiMessageCircle} href='/chat' />
        {isAuthenticated ? (
          <NavLink text='Log out' Icon={FiLogOut} onClick={handleLogout} />
        ) : (
          <NavLink text='Log in' Icon={FiLogIn} href='/login' />
        )}
      </div>
      <Menu />
    </motion.nav>
  );
};

interface LinkProps {
  text: string;
  Icon: IconType;
  href?: string; // optional if it's a navigation link
  onClick?: () => void; // optional if it's an action link
}

const NavLink = ({ text, Icon, href, onClick }: LinkProps) => {
  const baseClasses =
    'text-sm w-12 hover:text-indigo-500 transition-colors flex flex-col gap-1 items-center';

  // If href exists, render a Next.js link
  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <Icon />
        <span className='text-xs'>{text}</span>
      </Link>
    );
  }

  // Otherwise render a button (for actions like logout)
  return (
    <button onClick={onClick} className={baseClasses}>
      <Icon />
      <span className='text-xs'>{text}</span>
    </button>
  );
};
const MenuButton = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      onClick={() => setOpen((pv) => !pv)}
      className='text-xl font-bold h-full bg-black text-white rounded-l-md'
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='p-4'
      >
        <AnimatePresence mode='wait'>
          {open ? (
            <motion.span
              key='icon-1'
              className='block'
              variants={iconVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.125, ease: 'linear' }}
            >
              <FiX />
            </motion.span>
          ) : (
            <motion.span
              key='icon-2'
              className='block'
              variants={iconVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.125, ease: 'linear' }}
            >
              <FiMenu />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

const Menu = () => {
  const { theme, setTheme } = useTheme();
  return (
    <motion.div
      variants={menuVariants}
      style={{ transformOrigin: 'bottom', x: '-50%' }}
      className='p-8 rounded-md bg-white shadow-lg absolute bottom-[125%] left-[50%] flex w-full max-w-lg'
    >
      <div className='flex flex-col gap-2 w-1/2'>
        <SectionTitle text='Settings' />
        <MenuLink
          text="Mode"
          currentTheme={theme}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
        <MenuLink text='Blocked Users' />
      </div>
      <div className='flex flex-col gap-2 w-1/2'>
        <SectionTitle text='Profile' />
        <MenuLink text='View Profile' href='/profile' />
      </div>
    </motion.div>
  );
};

const SectionTitle = ({ text }: { text: string }) => {
  return (
    <motion.h4
      variants={menuLinkVariants}
      className='text-sm mb-2 font-semibold'
    >
      {text}
    </motion.h4>
  );
};

const MenuLink = ({
  currentTheme,
  text,
  href,
  onClick,
}: {
  currentTheme?: string;
  text: string;
  href?: string;
  onClick?: () => void;
}) => {
  const handleClick = () => {
    onClick?.();
  };
  return (
    <motion.a
      variants={menuLinkVariants}
      href={href ? href : '#'}
      rel='nofollow'
      onClick={handleClick}
      className='text-sm hover:text-indigo-500 transition-colors flex items-center gap-2'
    >
      {currentTheme && currentTheme === 'light' ? <Sun size={16}/> : currentTheme === 'dark' ? <Moon size={16}/> : ''}{' '}{text}
    </motion.a>
  );
};

export default Navbar;

const iconVariants = {
  initial: { rotate: 180, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  exit: { rotate: -180, opacity: 0 },
};

const menuVariants = {
  open: {
    scale: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  closed: {
    scale: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.05,
    },
  },
};

const menuLinkVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: -15,
    opacity: 0,
  },
};
