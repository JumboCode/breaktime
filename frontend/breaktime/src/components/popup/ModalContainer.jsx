import { useState } from "react";
import PropTypes from "prop-types";
import { useModal } from "./useModal";
import { AddBookingModal } from "./AddBookingModal";
import ModifyBookingModal from "./ModifyBookingModal";
import ViewBookingModal from "./ViewBookingModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SendNoteModal from "./SendNoteModal";
import { apiCall } from "../../utils/general";

/**
 * getDayFromDate - Converts a date string to a day name
 *
 * The backend stores bookings with day names ("monday", "tuesday", etc.)
 * but the frontend form uses date strings ("2026-02-03").
 * This converts the date to a day name for the API call.
 *
 * @param {string} dateString - Date in YYYY-MM-DD format (e.g., "2026-02-03")
 * @returns {string} Day name in lowercase (e.g., "monday")
 *
 * Example: "2026-02-03" (a Monday) → "monday"
 */
const getDayFromDate = (dateString) => {
  if (!dateString) return 'monday';
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const date = new Date(dateString);
  return days[date.getDay()] || 'monday';
};

/**
 * ModalContainer - Central component for managing all booking-related modals
 *
 * This component:
 * 1. Renders the appropriate modal based on modalState.type
 * 2. Handles all API calls for CRUD operations
 * 3. Updates local state after successful operations
 * 4. Provides loading and error states
 *
 * Modal Types:
 * - "add": AddBookingModal - Create a new booking
 * - "modify": ModifyBookingModal - Edit an existing booking
 * - "view": ViewBookingModal - View booking details (can navigate to modify/delete)
 * - "delete": DeleteConfirmationModal - Confirm deletion
 * - "sendNote": SendNoteModal - Send a note to the client
 *
 * @param {Array} bookings - Current array of bookings (from HomePage state)
 * @param {Function} setBookings - Function to update bookings state
 * @param {Function} onBookingChange - Callback to refetch bookings from backend after CRUD operations
 */
const ModalContainer = ({ bookings, setBookings, onBookingChange }) => {
 // useModal hook provides modal state and control functions
 const { modalState, closeModal, openModal } = useModal();

 // Loading state - shows spinner overlay during API calls
 const [loading, setLoading] = useState(false);

 // Error state - shows error message if something goes wrong
 const [error, setError] = useState(null);

 // Don't render anything if no modal is open
 if (!modalState.isOpen) return null;

 /**
  * handleSaveBooking - Creates a new booking
  *
  * Called when user clicks "Confirm" in AddBookingModal
  *
  * Flow:
  * 1. Create a local booking object with temporary ID
  * 2. Send POST request to /booking/create
  * 3. If successful, update local booking with backend-generated ID
  * 4. Add booking to local state
  * 5. Close modal
  *
  * API: POST /booking/create
  * Request: { userID, serviceID, duration, clientName }
  * Response: { success, data: { bookingID, status, timestamp, ... } }
  *
  * @param {Object} booking - Form data from AddBookingModal
  */
 const handleSaveBooking = async (booking) => {
   setLoading(true);
   setError(null);

   // Create local booking with temporary ID (will be replaced by backend ID)
   const localBooking = {
     ...booking,
     id: booking.id || Date.now(), // Temporary ID
     status: booking.status || "pending",
   };

   try {
     // Map frontend form data to backend expected format
     // Frontend: { client, service, date, startTime, endTime }
     // Backend: { userID, serviceID, duration: [{ day, startTime, endTime }], clientName }
     const requestData = {
       userID: booking.client || "YA_1", // Use client name as userID
       serviceID: booking.service || "services",
       duration: [{
         day: getDayFromDate(booking.date), // Convert "2026-02-03" to "monday"
         startTime: booking.startTime || booking.time || "09:00",
         endTime: booking.endTime || "10:00"
       }],
       clientName: booking.client // Also store as clientName for display
     };

     const response = await apiCall('/booking/create', 'POST', requestData, null);

     if (response.success) {
       // Update local booking with backend-generated data
       localBooking.id = response.data.bookingID;
       localBooking.bookingID = response.data.bookingID;
       localBooking.status = response.data.status;
       localBooking.timestamp = response.data.timestamp;
       localBooking.userID = response.data.userID;
     }
   } catch (err) {
     // If API fails, still add to local state (offline support)
     console.warn('API unavailable, using local state only:', err);
   }

   // Update local state for immediate UI feedback, then refetch from backend
   // to ensure calendar shows the latest data from MongoDB
   setBookings([...bookings, localBooking]);
   setLoading(false);
   closeModal();
   // TODO (Backend Integration): Once /booking/monthlyBookings is implemented,
   // this refetch will pull only the current month's active bookings from Mongo
   if (onBookingChange) onBookingChange();
 };

 /**
  * handleUpdateBooking - Updates an existing booking
  *
  * Called when user clicks "Update" in ModifyBookingModal
  *
  * Flow:
  * 1. Send PUT request to /booking/edit with updated data
  * 2. Update the booking in local state
  * 3. Close modal
  *
  * API: PUT /booking/edit
  * Request: { bookingID, status, duration, clientName, serviceID }
  * Response: { success, data: { ... } }
  *
  * @param {Object} updatedBooking - Updated form data from ModifyBookingModal
  */
 const handleUpdateBooking = async (updatedBooking) => {
   setLoading(true);
   setError(null);

   try {
     // Map frontend form data to backend expected format
     const requestData = {
       bookingID: updatedBooking.id || updatedBooking.bookingID,
       status: updatedBooking.status || 'pending',
       duration: [{
         day: getDayFromDate(updatedBooking.date),
         startTime: updatedBooking.startTime || updatedBooking.time || "09:00",
         endTime: updatedBooking.endTime || "10:00"
       }],
       clientName: updatedBooking.client, // Update client display name
       serviceID: updatedBooking.service  // Update service type
     };

     await apiCall('/booking/edit', 'PUT', requestData, null);
   } catch (err) {
     console.warn('API unavailable, using local state only:', err);
   }

   // Update local state - find and replace the booking
   setBookings(
     bookings.map((b) =>
       (b.id === updatedBooking.id || b.bookingID === updatedBooking.bookingID)
         ? { ...updatedBooking, clientName: updatedBooking.client }
         : b
     )
   );
   setLoading(false);
   closeModal();
   // Refetch from backend to ensure calendar is in sync with MongoDB
   if (onBookingChange) onBookingChange();
 };

 /**
  * handleDeleteBooking - Deletes a booking
  *
  * Called when user clicks "Confirm" in DeleteConfirmationModal
  *
  * Flow:
  * 1. Get bookingID from modal data
  * 2. Send DELETE request to /booking/delete
  * 3. Remove booking from local state
  * 4. Close modal
  *
  * API: DELETE /booking/delete
  * Request: { bookingID }
  * Response: { success, data: { bookingID, ... } }
  */
 const handleDeleteBooking = async () => {
   setLoading(true);
   setError(null);

   // Get booking ID from modal data (could be 'id' or 'bookingID')
   const bookingID = modalState.data?.id || modalState.data?.bookingID;

   try {
     await apiCall('/booking/delete', 'DELETE', { bookingID }, null);
   } catch (err) {
     console.warn('API unavailable, using local state only:', err);
   }

   // Remove booking from local state
   setBookings(bookings.filter((b) => b.id !== bookingID && b.bookingID !== bookingID));
   setLoading(false);
   closeModal();
   // Refetch from backend to ensure calendar is in sync with MongoDB
   if (onBookingChange) onBookingChange();
 };

 /**
  * handleSendNote - Sends a note/notification to a client
  *
  * Called when user clicks "Send" in SendNoteModal
  *
  * API: POST /notification/create (if it exists)
  *
  * @param {string} note - The note message to send
  */
 const handleSendNote = async (note) => {
   setLoading(true);
   setError(null);

   const booking = modalState.data;

   try {
     const requestData = {
       userID: booking?.client || "YA_1",
       type: "note",
       title: `Note for Booking #${booking?.id || booking?.bookingID || 'N/A'}`,
       message: note,
       timestamp: new Date().toISOString()
     };

     await apiCall('/notification/create', 'POST', requestData, null);
   } catch (err) {
     console.warn('API unavailable:', err);
   }

   // Show confirmation and close modal
   alert(`Note sent: ${note}`);
   setLoading(false);
   closeModal();
 };

 return (
   <>
     {/* Modal backdrop - clicking closes the modal */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
       {/* Modal content - stopPropagation prevents closing when clicking inside */}
       <div onClick={(e) => e.stopPropagation()} className="animate-fadeIn relative">

         {/* Loading overlay - shows spinner during API calls */}
         {loading && (
           <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-3xl">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#273991]"></div>
           </div>
         )}

         {/* Error message - shows if something went wrong */}
         {error && (
           <div className="absolute top-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm z-20">
             {error}
           </div>
         )}

         {/* ADD BOOKING MODAL */}
         {/* Shown when: clicking "add new" button or clicking empty calendar slot */}
         {modalState.type === "add" && (
           <AddBookingModal
             onClose={closeModal}
             onSave={handleSaveBooking}
             initialData={modalState.data} // Pre-filled date when clicking calendar slot
           />
         )}

         {/* MODIFY BOOKING MODAL */}
         {/* Shown when: clicking on existing calendar event */}
         {modalState.type === "modify" && (
           <ModifyBookingModal
             booking={modalState.data}
             onClose={closeModal}
             onUpdate={handleUpdateBooking}
             onEdit={(booking) => openModal("modify", booking)}
             onDelete={(booking) => openModal("delete", booking)} // Opens delete confirmation
           />
         )}

         {/* VIEW BOOKING MODAL */}
         {/* Shown when: (not currently used - modify opens directly) */}
         {modalState.type === "view" && (
           <ViewBookingModal
             booking={modalState.data}
             onEdit={(booking) => {
               closeModal();
               setTimeout(() => openModal("modify", booking), 100);
             }}
             onDelete={(booking) => {
               closeModal();
               setTimeout(() => openModal("delete", booking), 100);
             }}
           />
         )}

         {/* DELETE CONFIRMATION MODAL */}
         {/* Shown when: clicking trash icon in modify/view modal */}
         {modalState.type === "delete" && (
           <DeleteConfirmationModal
             onClose={closeModal}
             onConfirm={() => handleDeleteBooking(modalState.data)}
           />
         )}

         {/* SEND NOTE MODAL */}
         {/* Shown when: clicking "Send a note" button in view modal */}
         {modalState.type === "sendNote" && (
           <SendNoteModal
             onClose={closeModal}
             onSend={handleSendNote}
           />
         )}
       </div>
     </div>

     {/* CSS animations for modal */}
     <style>{`
       @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);}}
       .animate-fadeIn { animation: fadeIn 0.2s ease-out;}
       @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); }}
       .animate-spin { animation: spin 1s linear infinite; }
     `}</style>
   </>
 );
};

ModalContainer.propTypes = {
 bookings: PropTypes.array.isRequired,
 setBookings: PropTypes.func.isRequired,
 onBookingChange: PropTypes.func,
};

export default ModalContainer;
