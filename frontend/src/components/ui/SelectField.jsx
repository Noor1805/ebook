import React, { useState } from "react";

export default function SelectField({
  icon: Icon,
  label,
  name,
  options,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="block text-sm font-medium text-gray-700">
      <label htmlFor={name} className="">
        {label}
      </label>

      <div className="relative ">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}

        <select
          id={name}
          name={name}
          className={`w-full h-11 px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none
          ${Icon ? "pl-20" : ""}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
