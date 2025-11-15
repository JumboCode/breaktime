import PropTypes from "prop-types";
const FormInput = ({
 label,
 value,
 onChange,
 type = "text",
 required = false,
}) => (
 <div className="mb-4">
   <label className="block text-sm font-medium text-[#273991] mb-1">
     {label}
   </label>
   <input
     type={type}
     value={value}
     onChange={onChange}
     required={required}
     className="w-full px-4 py-2 bg-[#dadefd] text-[#232571] rounded-[14px] border-none focus:outline-none font-medium text-base placeholder:text-[#7375a6]"
   />
 </div>
);
FormInput.propTypes = {
 label: PropTypes.string.isRequired,
 value: PropTypes.string.isRequired,
 onChange: PropTypes.func.isRequired,
 type: PropTypes.string,
 required: PropTypes.bool,
};
export default FormInput;