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

 // TODO: Backend - POST /api/bookings to create new booking
 const handleSaveBooking = (booking) => setBookings([...bookings, booking]){
  try {
    
  } catch (error) {
    console.log("error creating booking", error);
  }
 };

 // TODO: Backend - PUT /api/bookings/:id to update booking
 const handleUpdateBooking = (updatedBooking) =>
   setBookings(
     bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
   );

 // TODO: Backend - DELETE /api/bookings/:id to delete booking
 const handleDeleteBooking = (booking) => {
   setBookings(bookings.filter((b) => b.id !== booking?.id));
   closeModal();
 };

 // TODO: Backend - POST /api/bookings/:id/notes to send note
 const handleSendNote = (note) =>
   alert(`Note sent: ${note}`);
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
             onEdit={(booking) => openModal("modify", booking)}
             onDelete={(booking) => openModal("delete", booking)}
           />
         )}
         {modalState.type === "view" && (
           <ViewBookingModal
             booking={modalState.data}
             onEdit={(booking) => {
               closeModal();
               setTimeout(() => openModal("modify", booking), 100);
             }}
             onDelete={handleDeleteBooking}
           />
         )}
         {modalState.type === "delete" && (
           <DeleteConfirmationModal
             onClose={closeModal}
             onConfirm={() => handleDeleteBooking(modalState.data)}
           />
         )}
         {modalState.type === "sendNote" && (
           <SendNoteModal
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


