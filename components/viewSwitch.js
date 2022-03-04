import React from "react";
import { motion } from "framer-motion";

export default function ViewSwitch({ onChange }) {
  const [state, setState] = React.useState("stacked");
  let handleChange = (e) => {
    setState(e.currentTarget.value);
    onChange(e.currentTarget.value);
  };
  return (
    <motion.div className="mb-4 max-w-xl flex rounded-md">
      <button
        onClick={handleChange}
        value="stacked"
        className={`w-full justify-center px-3 py-2 rounded flex align-center gap-1 ${
          state === "stacked"
            ? "shadow bg-gray-600 border border-gray-500"
            : "bg-gray-800 border border-gray-800 text-gray-400"
        }`}
        style={{}}
      >
        <StackedIcon />
        Stacked
      </button>
      <button
        onClick={handleChange}
        value="overlay"
        className={`w-full justify-center px-3 py-2 rounded flex align-center gap-1 ${
          state === "overlay"
            ? "shadow bg-gray-600 border border-gray-500"
            : "bg-gray-800 border border-gray-800 text-gray-400"
        }`}
        style={{}}
      >
        <OverlayIcon />
        Overlay
      </button>
    </motion.div>
  );
}

const StackedIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 4.5H7.5V6H21V4.5Z" />
      <path d="M21 18H7.5V19.5H21V18Z" />
      <path d="M21 11.25H7.5V12.75H21V11.25Z" />
      <path d="M4.5 11.25H3V12.75H4.5V11.25Z" />
      <path d="M4.5 4.5H3V6H4.5V4.5Z" />
      <path d="M4.5 18H3V19.5H4.5V18Z" />
    </svg>
  );
};

const OverlayIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.0001 17.9998C11.8759 17.9998 11.7537 17.9689 11.6445 17.9098L1.89453 12.6598L2.60568 11.3398L12.0001 16.3981L21.3945 11.3398L22.1057 12.6604L12.3557 17.9104C12.2464 17.9692 12.1242 18 12.0001 17.9998V17.9998Z" />
      <path d="M12.0001 22.4998C11.8759 22.4998 11.7537 22.4689 11.6445 22.4098L1.89453 17.1598L2.60568 15.8398L12.0001 20.8981L21.3945 15.8398L22.1057 17.1604L12.3557 22.4104C12.2464 22.4692 12.1242 22.5 12.0001 22.4998V22.4998Z" />
      <path d="M12.0001 13.5004C11.8759 13.5003 11.7537 13.4694 11.6445 13.4104L1.8945 8.16036C1.77531 8.09614 1.67572 8.00085 1.60631 7.8846C1.53689 7.76835 1.50024 7.63549 1.50024 7.50009C1.50024 7.3647 1.53689 7.23183 1.60631 7.11559C1.67572 6.99934 1.77531 6.90405 1.8945 6.83983L11.6445 1.58983C11.7537 1.53087 11.8759 1.5 12.0001 1.5C12.1242 1.5 12.2464 1.53087 12.3557 1.58983L22.1057 6.83983C22.2248 6.90405 22.3244 6.99934 22.3938 7.11559C22.4633 7.23183 22.4999 7.3647 22.4999 7.50009C22.4999 7.63549 22.4633 7.76835 22.3938 7.8846C22.3244 8.00085 22.2248 8.09614 22.1057 8.16036L12.3557 13.4104C12.2464 13.4694 12.1242 13.5003 12.0001 13.5004ZM3.83213 7.50036L12.0001 11.8986L20.168 7.50036L12.0001 3.10221L3.83213 7.50036Z" />
    </svg>
  );
};
