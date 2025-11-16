import { useState } from "react";
import PropTypes from "prop-types";
import logo from "../../assets/logos-icons/Icon_Heart/Breaktime_Icon_BrightBlue.png";

const SendNoteModal = ({ onClose, onSend }) => {
  // State to manage the content of the note
  const [note, setNote] = useState("");

  // Function to handle sending the note
  const handleSend = () => {
    onSend(note); // Pass the note content to the onSend callback
    onClose(); // Close the modal after sending
  };

  return (
    <div className="w-[237px] h-[237px] bg-[#F7FCFF] rounded-[24px] px-5 py-4 shadow-lg flex flex-col items-center poppins">
      {/* Logo */}
      <img src={logo} alt="Breaktime Logo" className="w-[41px] h-[41px] mb-1" />

      {/* Modal title */}
      <h2 className="text-[16px] font-semibold text-[#273991] mb-2 text-center">
        Send a Note
      </h2>

      {/* Textarea for entering the note */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Text here..."
        className="w-[197px] h-[70px] bg-white border-2 border-[#6297EA] rounded-[12px] text-[#8D8D8D] text-[12px] px-3 py-2 mb-2 resize-none placeholder:text-[#8D8D8D] placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6297EA] text-left"
      />

      {/* Cancel button */}
      <button
        type="button"
        onClick={onClose}
        className="text-[#B6B7FB] font-semibold text-[14px] mb-1 hover:underline text-center poppins"
      >
        Cancel
      </button>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!note.trim()}
        className="w-[126px] h-[34px] bg-[#ABB9FF] text-[#F0F7F2] font-semibold text-[16px] rounded-full px-4 py- shadow-md"
      >
        Send
      </button>
    </div>
  );
};

// Prop type validation
SendNoteModal.propTypes = {
  onClose: PropTypes.func.isRequired, // Function to handle modal close
  onSend: PropTypes.func.isRequired, // Function to handle sending the note
};

export default SendNoteModal;
