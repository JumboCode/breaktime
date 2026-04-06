import PropTypes from "prop-types";
const ServiceSelection = ({ selected, onSelect }) => {
 const services = [
   "Haircut",
   "Coloring",
   "Styling",
   "Treatment",
   "Consultation",
 ];
 return (
   <div className="mb-4">
     <label className="block text-sm font-medium text-[#273991] mb-2">
       Service Selection
     </label>
     <div className="grid grid-cols-2 gap-2">
       {services.map((service) => (
         <button
           key={service}
           type="button"
           onClick={() => onSelect(service)}
           className={`px-4 py-3 rounded-lg border-2 transition-all transform
             ${
               selected === service
                 ? "bg-[#eff6ff] border-[#3b82f6] font-bold opacity-100"
                 : "bg-white border-[#d1d5db] font-normal opacity-40"
             }`}
         >
           {service}
         </button>
       ))}
     </div>
   </div>
 );
};
ServiceSelection.propTypes = {
 selected: PropTypes.string.isRequired,
 onSelect: PropTypes.func.isRequired,
};
export default ServiceSelection;



