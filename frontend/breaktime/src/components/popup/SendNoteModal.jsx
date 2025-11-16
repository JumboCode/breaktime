import { useState } from "react";
import PropTypes from "prop-types";
import logo from "../../assets/logos-icons/Icon_Heart/Breaktime_Icon_PalePurple.png";

const SendNoteModal = ({ onClose, onSend }) => {
  // State to manage the content of the note
  const [note, setNote] = useState("");

  // Function to handle sending the note
  const handleSend = () => {
    onSend(note); // Pass the note content to the onSend callback
    onClose(); // Close the modal after sending
  };

  return (
    <div className="w-[237px] h-[237px] bg-[#F0F7F2] rounded-3xl px-5 py-4 shadow-lg flex flex-col items-center font-all">
      {/* Logo */}
      <img src={logo} alt="Breaktime Logo" className="w-[41px] h-[41px] mb-1" />

      {/* Modal title */}
      <h2 className="text-[20px] font-semibold text-[#262443] mb-2 text-center">
        Send a Note
      </h2>

      {/* Textarea for entering the note */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Text here..."
        className="w-[197px] h-[70px] bg-[#F0F7F2] border-2 border-[#ABB9FF] rounded-lg text-[#8D8D8D] text-[12px] px-3 py-2 mb-2 resize-none placeholder:text-[#8D8D8D] placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#6297EA] text-left"
      />

      {/* Cancel button */}
      <button
        type="button"
        onClick={onClose}
        className="text-[#ABB9FF] font-semibold text-[14px] mb-1 focus:underline text-center font-all"
      >
        Cancel
      </button>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!note.trim()}
        className="w-[126px] h-[34px] bg-[#ABB9FF] text-[#F0F7F2] focus:underline font-semibold text-[14px] rounded-2xl hover:scale-110 hover:shadow-xl transition-transform duration-200 ease-out font-semibold px-4 py-1 shadow-md hover:bg-[#94A5FA] transition"
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
