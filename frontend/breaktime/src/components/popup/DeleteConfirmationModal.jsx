import PropTypes from "prop-types";
import { X, Trash2 } from "lucide-react";
const DeleteConfirmationModal = ({ booking, onClose, onConfirm }) => (
 <div className="w-[355px] bg-white shadow-xl rounded-[32px] px-5 py-6 mx-auto font-sans">
   <div className="flex justify-between items-center mb-4">
     <h2 className="text-xl font-bold text-red-600 flex items-center">
       <Trash2 className="mr-2" size={24} /> Delete Booking
     </h2>
     <button
       type="button"
       onClick={onClose}
       className="text-gray-500 hover:text-gray-700"
     >
       <X size={24} />
     </button>
   </div>
   <div className="mb-6">
     <p className="text-[#273991] mb-2">
       Are you sure you want to delete this booking?
     </p>
     <div className="bg-red-50 p-4 rounded-lg border border-red-200">
       <p className="font-semibold">{booking.client}</p>
       <p className="text-sm text-gray-600">
         {booking.date} at {booking.time}
       </p>
       <p className="text-sm text-gray-600">{booking.service}</p>
     </div>
   </div>
   <div className="flex gap-3">
     <button
       type="button"
       onClick={onClose}
       className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
     >
       Cancel
     </button>
     <button
       type="button"
       onClick={() => {
         onConfirm(booking.id);
         onClose();
       }}
       className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transform hover:scale-105 transition-all shadow-lg"
     >
       Delete
     </button>
   </div>
 </div>
);
DeleteConfirmationModal.propTypes = {
 booking: PropTypes.object.isRequired,
 onClose: PropTypes.func.isRequired,
 onConfirm: PropTypes.func.isRequired,
};
export default DeleteConfirmationModal;