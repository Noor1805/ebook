import React from "react";

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  icon: Icon,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-sm hover:shadow-md ",

    secondary: "bg-gray-100  text-gray-700 hover:bg-gray-200 ",

    ghost: "text-gray-700 hover:bg-gray-100 bg-transparent",

    danger:
      " bg-transparent hover:bg-red-50 text-red-600 ",
  };

  const sizes = {
  sm: "px-3 py-1.5 text-sm h-8 rounded-lg",
  md: "px-4 py-2.5 h-11 text-sm rounded-xl",
  lg: "px-5 py-2.5 text-base rounded-xl",
};


  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 
        focus:outline-none focus:ring-violet-500 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
        ${variant} ${size} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-25"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A.962 7.962 0 014 12H0c0  3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
