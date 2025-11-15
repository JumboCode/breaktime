import { useState } from "react";
import PropTypes from "prop-types";
import {
 X,
 Calendar,
 Edit,
 Eye,
 Trash2,
 User,
 MessageSquare,
 Send,
} from "lucide-react";
import FormInput from "./FormInput";
import ServiceSelection from "./ServiceSelection";


// Add New Booking Modal
export const AddBookingModal = ({ onClose, onSave }) => {
 const [formData, setFormData] = useState({
   date: "",
   time: "",
   service: "",
   client: "",
   phone: "",
   notes: "",
 });
 const handleSubmit = (e) => {
   e.preventDefault();
   onSave({ ...formData, id: Date.now(), status: "pending" });
   onClose();
 };
 return (
   <div className="w-[355px] bg-[#f7fbfd] shadow-xl rounded-[32px] px-5 py-6 mx-auto font-sans">
     <div className="flex justify-between items-center mb-4">
       <h2 className="text-xl font-bold text-[#273991] flex items-center">
         <Calendar className="mr-2 text-blue-500" size={24} /> Add New Booking
       </h2>
       <button
         type="button"
         onClick={onClose}
         className="text-gray-500 hover:text-gray-700"
       >
         <X size={24} />
       </button>
     </div>
     <form onSubmit={handleSubmit}>
       <FormInput
         label="Client Name"
         value={formData.client}
         onChange={(e) =>
           setFormData((f) => ({ ...f, client: e.target.value }))
         }
         required
       />
       <FormInput
         label="Phone Number"
         value={formData.phone}
         onChange={(e) =>
           setFormData((f) => ({ ...f, phone: e.target.value }))
         }
         type="tel"
         required
       />
       <ServiceSelection
         selected={formData.service}
         onSelect={(service) => setFormData((f) => ({ ...f, service }))}
       />
       <div className="grid grid-cols-2 gap-3">
         <FormInput
           label="Date"
           value={formData.date}
           onChange={(e) =>
             setFormData((f) => ({ ...f, date: e.target.value }))
           }
           type="date"
           required
         />
         <FormInput
           label="Time"
           value={formData.time}
           onChange={(e) =>
             setFormData((f) => ({ ...f, time: e.target.value }))
           }
           type="time"
           required
         />
       </div>
       <FormInput
         label="Notes (Optional)"
         value={formData.notes}
         onChange={(e) =>
           setFormData((f) => ({ ...f, notes: e.target.value }))
         }
       />
       <button
         type="submit"
         className="w-full bg-[#c6d2ff] text-[#273991] py-3 rounded-[17px] font-semibold text-base hover:bg-[#d5ddff] mt-2"
       >
         Create Booking
       </button>
     </form>
   </div>
 );
};
AddBookingModal.propTypes = {
 onClose: PropTypes.func.isRequired,
 onSave: PropTypes.func.isRequired,
};


// Modify Booking Modal
export const ModifyBookingModal = ({ booking, onClose, onUpdate }) => {
 const [formData, setFormData] = useState(booking);
 const handleSubmit = (e) => {
   e.preventDefault();
   onUpdate(formData);
   onClose();
 };
 return (
   <div className="w-[355px] bg-[#f7fbfd] shadow-xl rounded-[32px] px-5 py-6 mx-auto font-sans">
     <div className="flex justify-between items-center mb-4">
       <h2 className="text-xl font-bold text-[#273991] flex items-center">
         <Edit className="mr-2 text-green-500" size={24} /> Modify Booking
       </h2>
       <button
         type="button"
         onClick={onClose}
         className="text-gray-500 hover:text-gray-700"
       >
         <X size={24} />
       </button>
     </div>
     <form onSubmit={handleSubmit}>
       <FormInput
         label="Client Name"
         value={formData.client}
         onChange={(e) =>
           setFormData((f) => ({ ...f, client: e.target.value }))
         }
         required
       />
       <ServiceSelection
         selected={formData.service}
         onSelect={(service) => setFormData((f) => ({ ...f, service }))}
       />
       <div className="grid grid-cols-2 gap-3">
         <FormInput
           label="Date"
           value={formData.date}
           onChange={(e) =>
             setFormData((f) => ({ ...f, date: e.target.value }))
           }
           type="date"
           required
         />
         <FormInput
           label="Time"
           value={formData.time}
           onChange={(e) =>
             setFormData((f) => ({ ...f, time: e.target.value }))
           }
           type="time"
           required
         />
       </div>
       <button
         type="submit"
         className="w-full bg-[#c6d2ff] text-[#273991] py-3 rounded-[17px] font-semibold text-base hover:bg-[#d5ddff] mt-2"
       >
         Update Booking
       </button>
     </form>
   </div>
 );
};
ModifyBookingModal.propTypes = {
 booking: PropTypes.object.isRequired,
 onClose: PropTypes.func.isRequired,
 onUpdate: PropTypes.func.isRequired,
};


// View Booking Modal
export const ViewBookingModal = ({ booking, onClose, onEdit }) => (
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
       {booking.status.toUpperCase()}
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


// Delete Confirmation Modal
export const DeleteConfirmationModal = ({ booking, onClose, onConfirm }) => (
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


// Send Note Modal
export const SendNoteModal = ({ booking, onClose, onSend }) => {
 const [note, setNote] = useState("");
 const handleSend = () => {
   onSend(booking.id, note);
   onClose();
 };
 return (
   <div className="w-[355px] bg-white shadow-xl rounded-[32px] px-5 py-6 mx-auto font-sans">
     <div className="flex justify-between items-center mb-4">
       <h2 className="text-xl font-bold text-[#273991] flex items-center">
         <Send className="mr-2 text-blue-500" size={24} /> Send Note
       </h2>
       <button
         type="button"
         onClick={onClose}
         className="text-gray-500 hover:text-gray-700"
       >
         <X size={24} />
       </button>
     </div>
     <div className="mb-4 bg-gray-50 p-3 rounded-lg">
       <p className="text-sm text-gray-600">Sending to:</p>
       <p className="font-semibold">{booking.client}</p>
     </div>
     <textarea
       value={note}
       onChange={(e) => setNote(e.target.value)}
       placeholder="Type your message here..."
       className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
     />
     <button
       type="button"
       onClick={handleSend}
       disabled={!note.trim()}
       className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
     >
       Send Message
     </button>
   </div>
 );
};
SendNoteModal.propTypes = {
 booking: PropTypes.object.isRequired,
 onClose: PropTypes.func.isRequired,
 onSend: PropTypes.func.isRequired,
};



