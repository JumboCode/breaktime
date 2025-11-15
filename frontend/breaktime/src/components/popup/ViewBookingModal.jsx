import PropTypes from "prop-types";
import { X, Eye, Calendar, User, MessageSquare } from "lucide-react";


const ViewBookingModal = ({ booking, onClose, onEdit }) => (
 <div className="w-[355px] bg-[#f7fbfd] shadow-xl rounded-[32px] px-5 py-6 mx-auto font-sans">
   <div className="flex justify-between items-center mb-4">
     <h2 className="text-xl font-bold text-[#273991] flex items-center">
       <Eye className="mr-2 text-purple-500" size={24} /> Booking Details
     </h2>
     <button
       type="button"
       onClick={onClose}
       className="text-gray-500 hover:text-gray-700"
     >
       <X size={24} />
     </button>
   </div>
   <div className="mb-4">
     <div className="flex gap-3 mb-2">
       <User className="text-blue-500" size={20} />
       <span className="font-semibold">Client:</span>
       <span className="ml-2 text-lg">{booking.client}</span>
     </div>
     <div className="flex gap-3 mb-2">
       <Calendar className="text-green-500" size={20} />
       <span className="font-semibold">Date & Time:</span>
       <span className="ml-2 text-lg">
         {booking.date} at {booking.time}
       </span>
     </div>
     <div className="flex gap-3 mb-2">
       <MessageSquare className="text-purple-500" size={20} />
       <span className="font-semibold">Service:</span>
       <span className="ml-2 text-lg">{booking.service}</span>
     </div>
     <span
       className={`px-3 py-1 rounded-full text-sm font-semibold ${
         booking.status === "confirmed"
           ? "bg-green-100 text-green-700"
           : "bg-yellow-100 text-yellow-700"
       }`}
     >
       {booking.status && booking.status.toUpperCase()}
     </span>
   </div>
   <button
     type="button"
     onClick={() => {
       onClose();
       onEdit(booking);
     }}
     className="w-full bg-[#c6d2ff] text-[#273991] py-3 rounded-[17px] font-semibold text-base hover:bg-[#d5ddff] mt-2"
   >
     Edit Booking
   </button>
 </div>
);
ViewBookingModal.propTypes = {
 booking: PropTypes.object.isRequired,
 onClose: PropTypes.func.isRequired,
 onEdit: PropTypes.func.isRequired,
};
export default ViewBookingModal;



