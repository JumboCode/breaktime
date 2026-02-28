import { useState } from "react";
import PropTypes from "prop-types";
import { Trash2, Edit } from "lucide-react";
import ServiceGraphics from "../../assets/popup-icons/Service_Graphics.png";

// Services
const SERVICE_OPTIONS = [
  { value: "services", label: "Shower Services" },
  { value: "laundry", label: "Laundry" },
  { value: "meeting", label: "Meeting" },
];

const ModifyBookingModal = ({
  booking,
  onEdit,
  onDelete,
  onClose,
  onUpdate,
}) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    client: booking.client || "",
    service: booking.service || SERVICE_OPTIONS[0].value,
    date: booking.date || "",
    startTime: booking.startTime || "",
    endTime: booking.endTime || "",
    note: booking.note || "",
  });
  // Validation state for time range
  const [timeError, setTimeError] = useState("");
  // Validation state for date (can't be in the past)
  const [dateError, setDateError] = useState("");

  // helper to convert "HH:MM" to minutes since midnight
  const timeToMinutes = (t) => {
    if (!t) return null;
    const [hh, mm] = t.split(":");
    const h = parseInt(hh, 10);
    const m = parseInt(mm, 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  const validateTimes = (start, end) => {
    // if either is empty, no validation error here (required attribute covers emptiness)
    if (!start || !end) return "";
    const s = timeToMinutes(start);
    const e = timeToMinutes(end);
    if (s === null || e === null) return "";
    if (e < s) return "End time cannot be earlier than start time.";
    return "";
  };

  const validateDate = (dateStr) => {
    if (!dateStr) return "";
    const selected = new Date(dateStr + "T00:00:00");
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (selected < today) return "Date cannot be earlier than today.";
    return "";
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...booking, ...formData }); // Update booking with new form data
    onClose(); // Close the modal
  };

  // form validity: require client, date, startTime and endTime, and no time error
  const isFormInvalid =
    !!timeError ||
    !!dateError ||
    !formData.client ||
    !formData.client.trim() ||
    !formData.date ||
    !formData.startTime ||
    !formData.endTime;

  return (
    <div className="flex justify-center items-center h-full poppins cursor-pointer">
      <div className="w-[334px] h-[509px] bg-[#f7fbfd] shadow-xl rounded-[32px] 
      px-5 py-6 font-poppins flex flex-col items-center">
        {/* Service image and dropdown */}
        <div className="relative rounded-[22px] overflow-hidden mb-3">
          <img src={ServiceGraphics} alt="Service" className="w-full" />
          <div className="absolute top-0 left-1 bg-[#7DDCFB] rounded-[18px] 
          px-3 py-1 shadow-md">
            <select
              className="bg-transparent p-0 font-bold text-[12px] 
              text-[#273991] border-none outline-none cursor-pointer"
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
          </div>
        </div>

        {/* Booking Info and Edit/Delete icons */}
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="text-[#273991] italic text-[16px]">
            Booking Info #{booking.id}
          </div>
          <div className="flex gap-2">
            {/* Delete button */}
            <button
              aria-label="Delete booking"
              className="text-[#273991] hover:bg-[#d5ddff] p-2 rounded-lg"
              onClick={() => onDelete(booking)}
              type="button"
            >
              <Trash2 size={20} />
            </button>
            {/* Edit button */}
            <button
              aria-label="Edit booking"
              className="text-[#273991] hover:bg-[#d5ddff] p-2 rounded-lg"
              onClick={() => onEdit(booking)}
              type="button"
            >
              <Edit size={20} />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 items-center w-full"
        >
          {/* Booking info fields */}
          <div className="mb-2 flex items-center gap-x-2 w-full">
            <span className="w-[98px] h-[40px] bg-[#B9FF00] text-[#273991] 
            rounded-[12px] px-3 py-1 font-semibold flex items-center justify-center">
              YA User
            </span>
            <input
              className="w-[198px] h-[40px] bg-[#ABB9FF] text-[#273991] rounded-[12px] px-3 py-1 font-semibold flex items-center justify-center outline-none"
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
            className="bg-[#ABB9FF] rounded-[12px] px-3 py-2 mb-2 text-[#273991] font-medium outline-none w-full"
            value={formData.date}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((f) => ({ ...f, date: val }));
              setDateError(validateDate(val));
            }}
            required
          />
          {dateError && (
            <div className="w-full text-sm text-red-600 mt-2" role="alert" aria-live="assertive">
              {dateError}
            </div>
          )}
          {/* Time range inputs */}
          <div className="flex items-center gap-2 w-full">
            <input
              type="time"
              className="flex-1 bg-[#ABB9FF] px-3 py-2 rounded-[12px] text-[#273991] font-medium text-center outline-none"
              value={formData.startTime}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((f) => ({ ...f, startTime: val }));
                // validate against current endTime
                setTimeError(validateTimes(val, formData.endTime));
              }}
              required
            />
            <span className="text-[#273991] font-semibold">to</span>
            <input
              type="time"
              className="flex-1 bg-[#ABB9FF] px-3 py-2 rounded-[12px] text-[#273991] font-medium text-center outline-none"
              value={formData.endTime}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((f) => ({ ...f, endTime: val }));
                // validate against current startTime
                setTimeError(validateTimes(formData.startTime, val));
              }}
              required
            />
          </div>

          {/* Time validation error */}
          {timeError && (
            <div
              className="w-full text-sm text-red-600 mt-2"
              role="alert"
              aria-live="assertive"
            >
              {timeError}
            </div>
          )}

          {/* Buttons at bottom */}
          <div className="mt-auto flex gap-2 w-full justify-center">
            {/* Cancel button */}
            <button
              type="button"
              className=" w-[160px] h-[44px] bg-[#ABB9FF] text-[#273991] py-2 rounded-[17px] justify-content[center] font-semibold text-base hover:bg-[#94A5FA]"
              onClick={onClose}
            >
              Cancel
            </button>
            {/* Update button */}
            <button
              type="submit"
              className="w-[160px]
                         h-[44px] bg-[#ABB9FF] text-[#273991] 
                         py-2 rounded-[17px] 
                         font-semibold 
                         text-base 
                         hover:bg-[#d5ddff] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFormInvalid}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModifyBookingModal.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    client: PropTypes.string,
    service: PropTypes.string,
    date: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ModifyBookingModal;
