import { useState } from "react";
import PropTypes from "prop-types";
import { ModalContext } from "./useModal";
const ModalProvider = ({ children }) => {
 const [modalState, setModalState] = useState({
   isOpen: false,
   type: null,
   data: null,
 });
 const openModal = (type, data = null) =>
   setModalState({ isOpen: true, type, data });
 const closeModal = () =>
   setModalState({ isOpen: false, type: null, data: null });
 return (
   <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
     {children}
   </ModalContext.Provider>
 );
};
ModalProvider.propTypes = { children: PropTypes.node.isRequired };
export default ModalProvider;


