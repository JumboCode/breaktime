import { motion } from 'framer-motion';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

export const Tagline = () => {
  const mobile = isMobile();
  const fontSize = mobile ? '18vw' : '140px';

  return (
    <div name="container" className="text-left">
      <h1 name="heading" className="font-medium leading-[0.95] -tracking-[0.02em] m-0">
        <span className="block text-[#b9ff00]" style={{ fontSize }}>
          Book
        </span>
        <span className="block text-[#b9ff00]" style={{ fontSize }}>
          Manage
        </span>
        <span className="block text-[#b9ff00] w-fit" style={{ fontSize }}>
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