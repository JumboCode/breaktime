import { motion } from "motion/react";

const getActivityStyles = (activityType) => {
  if (activityType === 'action') {
    return { icon: '⚠️', bgClass: 'bg-red-50', textClass: 'text-red-600', label: 'Action required' };
  }
  return { icon: 'ℹ️', bgClass: 'bg-blue-50', textClass: 'text-blue-600', label: 'Update' };
};

export default function InboxBookingSlideOut({ isOpen, onClose, booking }) {
    const activity = getActivityStyles(booking.activityType);
  
    // ...
    return (
      <>
        {/* Backdrop blur */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
  
        {/* Slide-out */}
        <motion.aside
          className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          initial={{ x: '100%' }}
          animate={{ x: isOpen ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          <header className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Booking details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </header>
  
          <section className="p-4 space-y-4 overflow-y-auto">
            {/* Activity block */}
            <div className={`rounded-md p-3 flex gap-3 items-start ${activity.bgClass}`}>
              <span className="text-xl">{activity.icon}</span>
              <div>
                <p className={`text-sm font-medium ${activity.textClass}`}>
                  {activity.label}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {booking.activityMessage}
                </p>
              </div>
            </div>
  
            {/* Booking details (dummy for now) */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Guest</p>
              <p className="text-base font-medium">{booking.guestName}</p>
  
              <p className="text-sm text-gray-500 mt-3">Time</p>
              <p className="text-base font-medium">{booking.time}</p>
  
              <p className="text-sm text-gray-500 mt-3">Location</p>
              <p className="text-base font-medium">{booking.location}</p>
            </div>
          </section>
        </motion.aside>
      </>
    );
  };
  