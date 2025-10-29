'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconType } from 'react-icons';
import {
  FiShoppingCart,
  FiSearch,
  FiPhone,
  FiMenu,
  FiHome,
  FiX,
  FiMessageCircle,
  FiHeart,
} from 'react-icons/fi';
import { Switch } from '../ui/switch';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      animate={open ? 'open' : 'closed'}
      initial='closed'
      className='bg-white rounded-md text-black shadow-lg flex items-center justify-between fixed bottom-8 left-[50%] -translate-x-[50%]'
    >
      <MenuButton setOpen={setOpen} open={open} />
      <div className='flex gap-6 px-6'>
        <Link text='Home' Icon={FiHome} />
        <Link text='Match' Icon={FiHeart} />
        <Link text='Chat' Icon={FiMessageCircle} />
        
      </div>
      <Menu />
    </motion.nav>
  );
};

const Link = ({ text, Icon }: { text: string; Icon: IconType }) => {
  return (
    <a
      href='#'
      rel='nofollow'
      className='text-sm w-12 hover:text-indigo-500 transition-colors flex flex-col gap-1 items-center'
    >
      <Icon />
      <span className='text-xs'>{text}</span>
    </a>
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
  return (
    <motion.div
      variants={menuVariants}
      style={{ transformOrigin: 'bottom', x: '-50%' }}
      className='p-8 rounded-md bg-white shadow-lg absolute bottom-[125%] left-[50%] flex w-[calc(100vw-48px)] max-w-lg'
    >
      <div className='flex flex-col gap-2 w-1/3'>
        <SectionTitle text='Settings' />
        <MenuLink text='Dark Mode'/>
        <MenuLink text='Blocked Users'/>
      </div>
      <div className="flex flex-col gap-2 w-1/3">
      <SectionTitle text="Preferences"/>
      <MenuLink text='Min Age' />
      <MenuLink text='Max Age' />
      <MenuLink text='Max Distance' />
      <MenuLink text='Gender Preferences' />
      </div>
      <div className="flex flex-col gap-2 w-1/3">
      <SectionTitle text="Profile"/>
      <MenuLink text="View Profile"/>
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

const MenuLink = ({ text }: { text: string; }) => {
  return (
    <motion.a
      variants={menuLinkVariants}
      href='#'
      rel='nofollow'
      className='text-sm hover:text-indigo-500 transition-colors flex items-center gap-2'
    >
      {text}
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
