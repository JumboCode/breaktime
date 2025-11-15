import { useState } from "react";
import PropTypes from "prop-types";
import { X, Send } from "lucide-react";


const SendNoteModal = ({ booking, onClose, onSend }) => {
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
export default SendNoteModal;



