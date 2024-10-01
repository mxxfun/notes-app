import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export function CustomCheckbox({ checked, onChange, id = "customCheckbox" }: CustomCheckboxProps) {
  return (
    <div className="inline-flex items-center">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={() => onChange(!checked)}
        aria-checked={checked}
      />
      <label 
        htmlFor={id} 
        className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#f97316"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </label>
    </div>
  );
}