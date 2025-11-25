import React, { useEffect, useRef, useState } from "react";

const Dropdown = ({ trigger, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
        <div onClick={() => setIsOpen(!isOpen)}>{trigger} </div>
        {isOpen && (
            <div
               className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg border border-slate-200 focus:outline-none" 
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
            >
                <div
                    className="py-1"
                    role="none"
                >
                    {children}
                    </div>
            </div>
        )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center w-full text-gray-700  px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-left"
            role="menuitem"
            tabIndex="-1"
        >
            {children}
        </button>
    );
}

export default Dropdown;
