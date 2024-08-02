import React from "react";

export default function Button({ children, onClick, color, fontColor }) {
  return (
    <button
      className={`py-2 px-4 rounded-md hover:opacity-90 flex items-center justify-center ${color} ${fontColor}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
