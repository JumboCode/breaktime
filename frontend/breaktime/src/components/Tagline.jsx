import { motion } from 'framer-motion';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

export const Tagline = () => {
  const mobile = isMobile();
  const fontSize = mobile ? '18vw' : '140px';
// [clamp(1.5rem,5vw,2.5rem)]
  return (
    <div name="container" className="text-left">
      <h1 name="heading" className="font-medium leading-[0.95] -tracking-[0.02em] m-0">
        <span className="block text-[#b9ff00] text-[clamp(2.5rem,12vw,140px)]">
          Book
        </span>
        <span className="block text-[#b9ff00] text-[clamp(2.5rem,12vw,140px)]">
          Manage
        </span>
        <span className="block text-[#b9ff00] w-fit text-[clamp(2.5rem,12vw,140px)] text-nowrap">
          C
          <motion.span
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ✱
          </motion.span>
          nnect.
        </span>
      </h1>
    </div>
  );
};