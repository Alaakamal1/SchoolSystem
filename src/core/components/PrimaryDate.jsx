import React from 'react'
import { Controller } from "react-hook-form";

const PrimaryDate = ({ control, name, label, error , disabled}) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-[#233955] mb-2">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
         disabled={disabled}

        render={({ field }) => (
          <input
            {...field}
            type="date"
            id={name}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              error ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 ${
              error ? "focus:ring-red-500" : "focus:ring-gray-100"
            } focus:border-transparent transition-colors`}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default PrimaryDate