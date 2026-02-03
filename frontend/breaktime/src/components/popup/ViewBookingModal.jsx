import PropTypes from "prop-types";
import { Edit, Trash2, ChevronLeft } from "lucide-react";
import ServiceGraphics from "../../assets/popup-icons/Service_Graphics.png";
import { useState } from "react";

// Import your modal components
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

  // Trigger the centralized delete flow
  const handleDeleteClick = () => {
    if (onDelete) onDelete(booking);
  };

  const handleSendNoteClick = () => setShowSendNotePopup(true);

  const handleSendNote = () => {
    setShowSendNotePopup(false);
    // Add logic to send/process note if needed
  };

  const handlePopupClose = () => {
    setShowSendNotePopup(false);
  };

  // Show send note popup if active
  if (showSendNotePopup) {
    return <SendNoteModal onClose={handlePopupClose} onSend={handleSendNote} />;
  }

  // Main modal content
  return (
    <div className="w-[334px] h-[509px] bg-[#f7fbfd] 
                   shadow-xl rounded-3xl p-2 m-1 font-all 
                   flex-col cursor-pointer">
      {/* Service image and dropdown */}
      <div className="relative rounded-[22px] mt-1 mb-1">
        <img src={ServiceGraphics} alt="Service" className="w-full" />
        {/* Service Dropdown */}
        <div className="absolute left-1 top-0 
                        w-[170px] h-[40px] bg-[#7DDCFB]
                        rounded-2xl p-2 shadow-md">
          <select
            className="appearance-none bg-transparent 
                      font-semibold 
                      text-base 
                      text-[#262445] 
                      pl-1 border-none
                      outline-none 
                      cursor-pointer"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronLeft
            strokeWidth={6}
            className="absolute
                      right-1 
                      top-1/2 
                      -translate-y-1/2 
                      w-5 h-5 
                      font-bold 
                      text-[#ABB9FF] 
                      pointer-events-none"
          />
        </div>
      </div>

      {/* Booking Info and Edit/Delete icons on same line */}
      <div className="flex justify-between items-center mb-1 ml-5 mr-2">
        <div className="text-black italic text-sm">
          Booking Info #{booking.id}
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Delete booking"
            className="text-[#273991] hover:bg-[#d5ddff] p-0 rounded-lg"
            onClick={handleDeleteClick}
          >
            <Trash2 size={23} />
          </button>
          <button
            aria-label="Edit booking"
            className="text-[#273991] hover:bg-[#d5ddff] p-0 rounded-lg"
            onClick={() => onEdit(booking)}
          >
            <Edit size={23} />
          </button>
        </div>
      </div>

      <div className="flex flex-col w-98/100 mx-1 justify-center spacing-y-10">
        <div className="mb-2 flex items-center gap-x-2">
          <span className="w-[98px] h-[40px] bg-[#B9FF00] 
                          text-[#262445] rounded-2xl px-3
                          py-1 font-semibold flex items-center justify-center">
            YA User
          </span>
          <span className="w-[205px] h-[40px] bg-[#E5EAFF] text-[#262445] rounded-2xl px-3 py-1 font-medium flex items-center justify-start">
            {booking.client}
          </span>
        </div>

        {/* Booking date and weekday */}
        <div className="bg-[#E5EAFF] 
                        rounded-2xl px-3 py-2 mb-2 
                        text-[#262445] 
                        font-medium">
          {formatDate(booking.date)}
        </div>

        {/* Booking time range */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 bg-[#E5EAFF] 
                          rounded-2xl px-3 py-2 
                          mb-2 text-[#262445] 
                          font-medium text-center">
            {booking.startTime || "9:00 am"}
          </div>
          <span className="text-[#262445] font-semibold">to</span>
          <div
            className="flex-1 bg-[#E5EAFF] rounded-2xl 
                        px-3 py-2 mb-2 text-[#262445] 
                        font-medium text-center"
          >
            {booking.endTime || "9:00 am"}
          </div>
        </div>
      </div>

      {/* Push the button to the bottom */}
      <div className="flex mt-21 bottom-0 w-full items-center justify-center">
        <button
          type="button"
          className="w-[306px] h-[40px] bg-[#ABB9FF] text-[#F0F7F2] py-2 
          rounded-2xl font-semibold text-base hover:underline focus:undrline 
          focus:bg-[#94A5FA]"
          onClick={handleSendNoteClick}
        >
          Send a note
        </button>
      </div>
    </div>
  );
};

// Prop types for the checking
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
