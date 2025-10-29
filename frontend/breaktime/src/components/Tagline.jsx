import { motion } from 'framer-motion';

// ==================== Tagline.jsx ====================
export const Tagline = () => {
  return (
    <div className="tagline-container">
      <h1 className="tagline-heading">
        <span className="tagline-text">Book</span>
        <span className="tagline-text">Manage</span>
        <span className="tagline-text">
          C
          <motion.span
            className="tagline-asterisk"
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
      <p className="tagline-description">
        Sign in to access your bookings,<br />
        schedules, and tools
      </p>
    </div>
  );
};