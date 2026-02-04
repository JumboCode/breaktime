import React from "react";;
import logo from "../../assets/logos-icons/Icon_Heart/Breaktime_Icon_PalePurple.png";


export const FailurePopup = ({ onClose }) => (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-[237px] h-[237px] bg-[#F0F7F2] rounded-3xl px-5 py-4 shadow-lg flex flex-col items-center font-all">
              {/* Logo */}
              <img src={logo} alt="Breaktime Logo" className="w-[41px] h-[41px] mb-1" />
        
              {/* Modal title */}
              <h2 className="text-[20px] font-semibold text-[#262443] mb-2 text-center">
                Almost There
              </h2> 
              <p className="text-sm text-[#262445] mb-6 text-center">
                Please finish filling out all <br></br>
                required fields before <br></br>
                submitting
              </p>         
        
              {/* Send button */}
              <button
                type="button"
                onClick={onClose}
                className="w-[126px] h-[34px] bg-[#ABB9FF] text-[#F0F7F2] focus:underline font-semibold text-[14px] rounded-2xl hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-out font-semibold px-4 py-1 shadow-md hover:bg-[#94A5FA] transition"
              >
                Go Back
              </button>
        </div>
    </div>
);

export const ConfirmationPopup = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-[237px] h-[237px] bg-[#F0F7F2] rounded-3xl px-5 py-4 shadow-lg flex flex-col items-center font-all">
            {/* Logo */}
              <img src={logo} alt="Breaktime Logo" className="w-[41px] h-[41px] mb-1" />

            <h2 className="text-[20px] font-semibold text-[#262443] mb-2 text-center">Confirmation</h2>
            <p className="text-sm text-center text-[#262445] mb-4">
                Are you ready to submit <br></br> this booking?
            </p>
            <div className="flex flex-col gap-1">
                <button
                    onClick={onClose}
                    className="px-8 py-1 bg-transparent text-[#ABB9FF] text-small font-semibold"
                >
                    Go Back
                </button>
                <button
                    onClick={onConfirm}
                    className="w-[126px] h-[34px] bg-[#ABB9FF] text-[#F0F7F2] focus:underline font-semibold text-[14px] rounded-2xl hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-out font-semibold px-4 py-1 shadow-md hover:bg-[#94A5FA] transition"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

export const SuccessPopup = ({ onClose }) => (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-[237px] h-[237px] bg-[#F0F7F2] rounded-3xl px-5 py-4 shadow-lg flex flex-col items-center font-all">
              {/* Logo */}
              <img src={logo} alt="Breaktime Logo" className="w-[41px] h-[41px] mb-1" />
        
              {/* Modal title */}
              <h2 className="text-[20px] font-semibold text-[#262443] mb-2 text-center">
                Confirmed
              </h2> 
              <p className="text-sm text-center text-[#262445] mb-6">
                Your booking has been <br></br> successfully submitted! <br></br> 🎉🎉
              </p>         
        
              {/* Send button */}
              <button
                type="button"
                onClick={onClose}
                className="w-[126px] h-[34px] bg-[#ABB9FF] text-[#F0F7F2] focus:underline font-semibold text-[14px] rounded-2xl hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-out font-semibold px-4 py-1 shadow-md hover:bg-[#94A5FA] transition"
              >
                Done
              </button>
        </div>
    </div>
);