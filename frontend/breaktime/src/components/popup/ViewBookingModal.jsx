import PropTypes from "prop-types";
import { Edit, Trash2 } from "lucide-react";
import ServiceGraphics from "../../assets/popup-icons/Service_Graphics.png";
import { useState } from "react";

// Import your modal components
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SendNoteModal from "./SendNoteModal";

const SERVICE_OPTIONS = [
  { value: "shower", label: "Shower Services" },
  { value: "laundry", label: "Laundry" },
  { value: "meeting", label: "Meeting" },
];

const ViewBookingModal = ({ booking, onEdit, onDelete }) => {
  // State for the selected service
  const [selectedService, setSelectedService] = useState(
    booking?.service || SERVICE_OPTIONS[0].value
  );

  // State for which popup/modal to display
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSendNotePopup, setShowSendNotePopup] = useState(false);

  // Handler functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  };

  // Show delete confirmation and replace this modal with the popup
  const handleDeleteClick = () => setShowDeletePopup(true);

  const handleDeleteConfirm = () => {
    setShowDeletePopup(false);
    if (onDelete) onDelete(booking);
  };

  const handleSendNoteClick = () => setShowSendNotePopup(true);

  const handleSendNote = () => {
    setShowSendNotePopup(false);
    // Add logic to send/process note if needed
  };

  const handlePopupClose = () => {
    setShowDeletePopup(false);
    setShowSendNotePopup(false);
  };

  // Popups take precedence and hide the main modal
  if (showDeletePopup) {
    return (
      <DeleteConfirmationModal
        onClose={handlePopupClose}
        onConfirm={handleDeleteConfirm}
      />
    );
  }

  if (showSendNotePopup) {
    return (
      <SendNoteModal
        onClose={handlePopupClose}
        onSend={handleSendNote}
      />
    );
  }

  // Main modal content
  return (
    <div className="w-[334px] h-[509px] bg-[#f7fbfd] shadow-xl rounded-[32px] px-5 py-6 mx-auto font-poppins flex flex-col">
      {/* Service image and dropdown */}
      <div className="relative rounded-[22px] overflow-hidden mb-3">
        <img src={ServiceGraphics} alt="Service" className="w-full" />
        {/* Service Dropdown */}
        <div className="absolute top-0 left-1 bg-[#7DDCFB] rounded-[18px] px-2 py-1 shadow-md">
          <select
            className="bg-transparent font-bold text-[12px] text-[#273991] border-none outline-none cursor-pointer"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Booking Info and Edit/Delete icons on same line */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-[#273991] italic text-[16px]">
          Booking Info #{booking.id}
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Delete booking"
            className="text-[#273991] hover:bg-[#d5ddff] p-2 rounded-lg"
            onClick={handleDeleteClick}
          >
            <Trash2 size={20} />
          </button>
          <button
            aria-label="Edit booking"
            className="text-[#273991] hover:bg-[#d5ddff] p-2 rounded-lg"
            onClick={() => onEdit(booking)}
          >
            <Edit size={20} />
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-x-2">
        <span className="w-[98px] h-[40px] bg-[#B9FF00] text-[#273991] rounded-[12px] px-3 py-1 font-semibold flex items-center justify-center">
          YA User
        </span>
        <span className="w-[198px] h-[40px] bg-[#E5EAFF] text-[#273991] rounded-[12px] px-3 py-1 font-semibold flex items-center justify-center">
          {booking.client}
        </span>
      </div>

      {/* Booking date and weekday */}
      <div className="bg-[#E5EAFF] rounded-[12px] px-3 py-2 mb-2 text-[#273991] font-medium">
        {formatDate(booking.date)}
      </div>

      {/* Booking time range */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 bg-[#E5EAFF] px-3 py-2 rounded-[12px] text-[#273991] font-medium text-center">
          {booking.startTime || "N/A"}
        </div>
        <span className="text-[#273991] font-semibold">to</span>
        <div className="flex-1 bg-[#E5EAFF] px-3 py-2 rounded-[12px] text-[#273991] font-medium text-center">
          {booking.endTime || "N/A"}
        </div>
      </div>

      {/* Push the button to the bottom */}
      <div className="mt-auto">
        <button
          type="button"
          className="w-[306px] h-[40px] bg-[#ABB9FF] text-[#273991] py-3 rounded-[17px] font-semibold text-base hover:bg-[#d5ddff]"
          onClick={handleSendNoteClick}
        >
          Send a note
        </button>
      </div>
    </div>
  );
};

ViewBookingModal.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    client: PropTypes.string,
    service: PropTypes.string,
    date: PropTypes.string,
    weekday: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default ViewBookingModal;
