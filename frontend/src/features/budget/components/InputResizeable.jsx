import React from "react";

export default function InputResizeable({
  defaultValue,
  onChange,
  onBlur,
  value,
  type,
}) {
  return (
    <div>
      <span>$</span>

      <input
        className="w-20 ml-1 outline-none focus:bg-red-200 rounded-md"
        onBlur={onBlur}
        type={type}
        defaultValue={defaultValue}
        value={value || ""} // Ensure value is not null or undefined
        onChange={onChange}
      />
    </div>
  );
}
