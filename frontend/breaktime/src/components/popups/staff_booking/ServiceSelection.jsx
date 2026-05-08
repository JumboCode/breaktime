import PropTypes from "prop-types";

const ServiceSelection = ({ selected, onSelect, services }) => {
 return (
   <div className="mb-4">
     <label className="block text-sm font-medium text-[#273991] mb-2">
       Service Selection
     </label>
     <div className="grid grid-cols-2 gap-2">
       {services.map((service) => (
         <button
           key={service.value}
           type="button"
           onClick={() => onSelect(service.value)}
           className={`px-4 py-3 rounded-lg border-2 transition-all transform
             ${
               selected === service.value
                 ? "bg-[#eff6ff] border-[#3b82f6] font-bold opacity-100"
                 : "bg-white border-[#d1d5db] font-normal opacity-40"
             }`}
         >
           {service.label}
         </button>
       ))}
     </div>
   </div>
 );
};

ServiceSelection.propTypes = {
 selected: PropTypes.string.isRequired,
 onSelect: PropTypes.func.isRequired,
 services: PropTypes.arrayOf(PropTypes.shape({
   value: PropTypes.string.isRequired,
   label: PropTypes.string.isRequired,
 })).isRequired,
};

export default ServiceSelection;
