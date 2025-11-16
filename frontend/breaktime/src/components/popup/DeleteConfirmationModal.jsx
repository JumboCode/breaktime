import PropTypes from "prop-types";
import logo from "../../assets/logos-icons/Icon_Heart/Breaktime_Icon_PalePurple.png";

// DeleteConfirmationModal component displays a modal for confirming the deletion of a booking
const DeleteConfirmationModal = ({ onClose, onConfirm }) => (
  <div className="w-[237px] h-[237px] bg-[#F0F7F2] rounded-3xl px-5 py-4 mx-auto shadow-lg flex flex-col items-center font-all">
    {/* Logo */}
    <img
      src={logo}
      alt="Breaktime Logo"
      className="w-[41px] h-[41px] mb-1"
    />

    {/* Modal title */}
    <h2 className="text-[20px] font-semibold text-[#262443] mb-2 text-center">
      Delete Booking
    </h2>

    {/* Modal description */}
    <p className="text-[#262443] text-[15px] text-center my-2 leading-5">
      Are you sure you want to<br />
      delete this booking?
    </p>

    {/* Action buttons */}
    <div className="flex flex-col gap-1 w-full items-center mt-auto">
      {/* Cancel button */}
      <button
        type="button"
        onClick={onClose}
        className="text-[#B6B7FB] font-semibold text-[16px] hover:underline text-center"
      >
        Cancel
      </button>

      {/* Confirm button */}
      <button
        type="button"
        onClick={onConfirm}
        className="w-[118px] h-[30px] bg-[#ABB9FF] text-[#F0F7F2] focu:underline shover:scale-110 hover:shadow-xl transition-transform duration-200 ease-out font-semibold text-[16px] rounded-full px-4 py-1 shadow-md hover:bg-[#9da0e9] transition"
      >
        Confirm
      </button>
    </div>
  </div>
);

// Prop type validation for the component
DeleteConfirmationModal.propTypes = {
  onClose: PropTypes.func.isRequired, // Function to handle closing the modal
  onConfirm: PropTypes.func.isRequired, // Function to handle confirming the deletion
};

export default DeleteConfirmationModal;
