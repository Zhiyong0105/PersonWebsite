import React from "react";

export default function CustomAlert({ message, type = "info", onClose }) {
  return (
    <div role="alert" className={`alert alert-${type} flex items-center gap-4`}>
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current h-6 w-6 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      {/* Message */}
      <span>{message}</span>
      {/* Close Button */}
      <button className="btn btn-sm btn-error" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
