import { motion } from 'framer-motion';

// ==================== Tagline.jsx ====================
export const Tagline = () => {
  return (
    <div name="container" className="text-left">
      <h1 name="heading" className="font-medium leading-[0.95] -tracking-[0.02em] m-0">
        <span className="block text-[#b9ff00] text-[140px]">
          Book
        </span>
        <span className="block text-[#b9ff00] text-[140px]">
          Manage
        </span>
        <span className="block text-[#b9ff00] text-[140px]">
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
      <p className="text-[#ABB9FF] text-base mt-[24px] font-display font-light leading-[1.6]">
        Sign in to access your bookings,<br />
        schedules, and tools
      </p>
    </div>
  );
};