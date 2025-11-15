import { useState } from "react";
import PropTypes from "prop-types";
import { X, Edit } from "lucide-react";
import FormInput from "./FormInput";
import ServiceSelection from "./ServiceSelection";


const ModifyBookingModal = ({ booking, onClose, onUpdate }) => {
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
export default ModifyBookingModal;



