import React from "react";

const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-purple-700"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3 w-5 h-5 text-purple-400 pointer-events-none" />
        )}

        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
          className={`
            w-full h-11 rounded-lg border border-purple-200 
            bg-white text-gray-800 text-sm
            placeholder-gray-400
            focus:ring-2 focus:ring-purple-500
            focus:border-transparent outline-none transition-all
            ${Icon ? "pl-11" : "pl-3"}
            ${error ? "border-red-500" : ""}
          `}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;

