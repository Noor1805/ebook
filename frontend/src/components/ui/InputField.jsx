import React from "react";

const InputField = ({ 
  icon: Icon, 
  label, 
  name, 
  onChange,
  value,
  ...props 
}) => {
  return (
    <div className="space-y-2">

      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">

        {Icon && (
          <div className="absolute inset-y-0 ml-3 pointer-events-none flex items-center">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}

        <input
          id={name}
          name={name}
          value={value}            // ⭐ REQUIRED
          onChange={onChange}      // ⭐ REQUIRED
          {...props}
          className={`
            w-full h-11 px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900
            placeholder-gray-400 focus:outline-none 
            focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
            ${Icon ? "pl-10" : ""}
          `}
        />
      </div>
    </div>
  );
};

export default InputField;

