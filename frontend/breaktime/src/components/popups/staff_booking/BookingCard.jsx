import PropTypes from "prop-types";
import { Calendar, Send } from "lucide-react";
const BookingCard = ({ booking, onView, onEdit, onDelete, onSendNote }) => (
 <div className="w-[355px] bg-[#f7fbfd] shadow-[0_3px_16px_#2947ac07,0_1.5px_2.5px_#0001] rounded-[32px] flex flex-col px-[18px] py-[20px] mx-auto my-4 font-sans">
   <div className="flex justify-between items-start mb-3">
     <div>
       <h3 className="font-bold text-lg text-[#273991]">{booking.client}</h3>
       <p className="text-sm text-[#232571]">{booking.service}</p>
     </div>
     <span
       className={`px-2 py-1 rounded text-xs font-semibold ${
         booking.status === "confirmed"
           ? "bg-green-100 text-green-700"
           : "bg-yellow-100 text-yellow-700"
       }`}
     >
       {booking.status}
     </span>
   </div>
   <div className="text-sm text-[#232571] mb-3">
     <p className="flex items-center">
       <Calendar size={14} className="mr-2" />
       {booking.date}
     </p>
     <p className="flex items-center">{booking.time}</p>
   </div>
   <div className="flex gap-2">
     <button
       type="button"
       onClick={() => onView(booking)}
       className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-all"
     >
       View
     </button>
     <button
       type="button"
       onClick={() => onEdit(booking)}
       className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-all"
     >
       Edit
     </button>
     <button
       type="button"
       onClick={() => onDelete(booking)}
       className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-all"
     >
       Delete
     </button>
     <button
       type="button"
       onClick={() => onSendNote(booking)}
       className="bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 transition-all"
     >
       <Send size={16} />
     </button>
   </div>
 </div>
);
BookingCard.propTypes = {
 booking: PropTypes.object.isRequired,
 onView: PropTypes.func.isRequired,
 onEdit: PropTypes.func.isRequired,
 onDelete: PropTypes.func.isRequired,
 onSendNote: PropTypes.func.isRequired,
};
export default BookingCard;



