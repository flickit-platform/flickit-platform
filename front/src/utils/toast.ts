import { ToastContainerProps, Flip } from "react-toastify";

export const toastDefaultConfig: ToastContainerProps = {
  position: "top-center",
  autoClose: 4000,
  limit: 4,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: true,
  pauseOnHover: true,
  transition: Flip,
};
