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
import ServiceGraphics from "../../assets/popup-icons/Service_Graphics.png";
import ServiceSelection from "./ServiceSelection";
import { ChevronLeft } from 'lucide-react';

// Available service types for the dropdown
const SERVICE_OPTIONS = [
  { value: "services", label: "Shower Services" },
  { value: "laundry", label: "Laundry" },
  { value: "meeting", label: "Meeting" },
];

/**
 * AddBookingModal - Modal for creating a new booking
 *
 * This modal is shown when:
 * 1. User clicks "add new" button in the calendar toolbar
 * 2. User clicks on an empty slot in the calendar (date will be pre-filled)
 *
 * Form Fields:
 * - service: Type of service (dropdown)
 * - client: Client name (text input)
 * - date: Booking date (date picker) - pre-filled when clicking calendar slot
 * - startTime: Start time (time picker)
 * - endTime: End time (time picker)
 * - notes: Optional notes (textarea)
 *
 * On Submit:
 * - Calls onSave with form data
 * - ModalContainer.handleSaveBooking sends data to POST /booking/create
 *
 * @param {Function} onClose - Function to close the modal
 * @param {Function} onSave - Function to save the booking (calls API)
 * @param {Object} initialData - Pre-filled data (e.g., { date: "2026-02-03" } when clicking calendar)
 */
export const AddBookingModal = ({ onClose, onSave, initialData }) => {
 // Form state - initialized with initialData if provided (e.g., pre-filled date)
 const [formData, setFormData] = useState({
   date: initialData?.date || "",           // Pre-filled when clicking calendar slot
   startTime: initialData?.startTime || "",
   endTime: initialData?.endTime || "",
   service: initialData?.service || "services",
   client: initialData?.client || "",
   phone: initialData?.phone || "",
   notes: initialData?.notes || "",
 });

 /**
  * handleSubmit - Called when user clicks "Confirm" button
  *
  * Creates a booking object with:
  * - All form data
  * - Temporary ID (Date.now()) - will be replaced by backend-generated ID
  * - Status "pending"
  *
  * Then calls onSave (which triggers ModalContainer.handleSaveBooking)
  */
 const handleSubmit = (e) => {
   e.preventDefault();
   onSave({ ...formData, id: Date.now(), status: "pending" });
   onClose();
 };
 return (
  <div className="flex justify-center items-center h-full font-all border-none">
    <div className="w-[334px] h-[509px] bg-[#f7fbfd] shadow-xl rounded-3xl p-2 m-1 flex-col">
      {/* Service image and dropdown */}
      <div className="relative rounded-[22px] mt-1 mb-1">
        <img src={ServiceGraphics} alt="Service" className="w-full"/>
        {/* Service Dropdown */}
        <div className="absolute left-1 top-0 w-[170px] h-[40px] bg-[#7DDCFB] rounded-2xl p-2 shadow-md">
          <select
              className="appearance-none bg-transparent font-semibold text-base text-[#262445] pl-1 border-none outline-none cursor-pointer"
              value={formData.service}
              onChange={(e) =>
                setFormData((f) => ({ ...f, service: e.target.value }))
              }
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
           <ChevronLeft strokeWidth={6} className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 font-bold text-[#ABB9FF] pointer-events-none" />
        </div>
      </div>
      <div className="spacing-y-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 items-center w-full"
        >
          {/* Booking info fields */}
          <div className="mb-2 flex items-center gap-x-3 w-full ml-1">
            <span className="w-[98px] h-[40px] bg-[#B9FF00] shadow-xl text-[#262445] rounded-2xl px-3 py-1 font-semibold flex items-center justify-center">
              YA User
            </span>
            <input
              className="w-[202px] h-[40px] bg-[#ABB9FF] font-medium shadow-xl rounded-2xl px-3 py-1 font-medium flex items-center justify-center placeholder:text-[#262445] caret-[#262445] hover:underline text-[#262445] outline-none focus:ouline-none focus:ring-0 focus:border-none"
              value={formData.client}
              onChange={(e) =>
                setFormData((f) => ({ ...f, client: e.target.value }))
              }
              required
              placeholder="Client Name"
            />
          </div>
          {/* Date input */}
          <input
            type="date"
            className="shadow-xl bg-[#ABB9FF] opacity-40 focus:opacity-100 w-98/100 hover:underline rounded-2xl px-3 py-2 mb-2 text-[#262445] font-medium outline-none"
            value={formData.date}
            onChange={(e) =>
              setFormData((f) => ({ ...f, date: e.target.value }))
            }
            required
          />
          {/* Time range inputs */}
          <div className="flex items-center gap-2 w-98/100">
            <input
              type="time"
              className="flex-1 bg-[#ABB9FF] opacity-40 focus:opacity-100 px-3 py-2 shadow-xl rounded-2xl text-[#262445] font-medium text-center outline-none"
              value={formData.startTime}
              onChange={(e) =>
                setFormData((f) => ({ ...f, startTime: e.target.value }))
              }
              required
            />
            <span className="text-[#262445] font-semibold">to</span>
            <input
              type="time"
              className="flex-1 bg-[#ABB9FF] opacity-40 focus:opacity-100 px-3 py-2 shadow-xl rounded-2xl text-[#262445] font-medium text-center outline-none"
              value={formData.endTime}
              onChange={(e) =>
                setFormData((f) => ({ ...f, endTime: e.target.value }))
              }
              required
            />
          </div>
          {/* Notes input */}
          <textarea
            type="text"
            className="mt-2 bg-[#ABB9FF] h-[70px] text-align opacity-40 focus:opacity-100 w-98/100 shadow-xl hover:underline resize-none rounded-2xl py-2 px-3 mb-2 text-[#262445] font-medium outline-none"
            value={formData.notes}
            onChange={(e) =>
              setFormData((f) => ({ ...f, notes: e.target.value }))
            }
            placeholder="(Optional) add a note..."
          />

          {/* Buttons at bottom */}
          <div className="flex mt-13 bottom-0 gap-3 w-full justify-center">
            {/* Cancel button */}
            <button
              type="button"
              className="w-[145px] h-[40px] hover:scale-110 hover:shadow-xl focus:bg-[#94A5FA] focus:underline transition-transform duration-200 ease-out bg-[#ABB9FF] text-[#F0F7F2] py-2 rounded-2xl justify-content[center] font-semibold text-base"
              onClick={onClose}
            >
              Cancel
            </button>
            {/* Update button */}
            <button
              type="submit"
              className="w-[145px] h-[40px] hover:scale-110 hover:shadow-xl focus:bg-[#94A5FA] focus:underline transition-transform duration-200 ease-out bg-[#ABB9FF] text-[#F0F7F2] py-2 rounded-2xl font-semibold text-base hover:p-2"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
 );
};
AddBookingModal.propTypes = {
 onClose: PropTypes.func.isRequired,
 onSave: PropTypes.func.isRequired,
 initialData: PropTypes.object,
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



