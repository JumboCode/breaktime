import PropTypes from "prop-types";
import { useModal } from "./useModal";
import { AddBookingModal } from "./AddBookingModal";
import ModifyBookingModal from "./ModifyBookingModal";
import ViewBookingModal from "./ViewBookingModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SendNoteModal from "./SendNoteModal";



const ModalContainer = ({ bookings, setBookings }) => {
 const { modalState, closeModal, openModal } = useModal();
 if (!modalState.isOpen) return null;
 const handleSaveBooking = (booking) => setBookings([...bookings, booking]);
 const handleUpdateBooking = (updatedBooking) =>
   setBookings(
     bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
   );
 const handleDeleteBooking = (id) =>
   setBookings(bookings.filter((b) => b.id !== id));
 const handleSendNote = (id, note) =>
   alert(`Note sent to booking #${id}: ${note}`);
 return (
   <>
     <div
       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
       onClick={closeModal}
       style={{ backdropFilter: "blur(4px)" }}
     >
       <div onClick={(e) => e.stopPropagation()} className="animate-fadeIn">
         {modalState.type === "add" && (
           <AddBookingModal onClose={closeModal} onSave={handleSaveBooking} />
         )}
         {modalState.type === "modify" && (
           <ModifyBookingModal
             booking={modalState.data}
             onClose={closeModal}
             onUpdate={handleUpdateBooking}
           />
         )}
         {modalState.type === "view" && (
           <ViewBookingModal
             booking={modalState.data}
             onClose={closeModal}
             onEdit={(booking) => {
               closeModal();
               setTimeout(() => openModal("modify", booking), 100);
             }}
           />
         )}
         {modalState.type === "delete" && (
           <DeleteConfirmationModal
             booking={modalState.data}
             onClose={closeModal}
             onConfirm={handleDeleteBooking}
           />
         )}
         {modalState.type === "sendNote" && (
           <SendNoteModal
             booking={modalState.data}
             onClose={closeModal}
             onSend={handleSendNote}
           />
         )}
       </div>
     </div>
     <style>{`
       @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);}}
       .animate-fadeIn { animation: fadeIn 0.2s ease-out;}
     `}</style>
   </>
 );
};
ModalContainer.propTypes = {
 bookings: PropTypes.array.isRequired,
 setBookings: PropTypes.func.isRequired,
};
export default ModalContainer;


