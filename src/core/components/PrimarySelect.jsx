import React from 'react';
import { Controller } from 'react-hook-form';

const PrimarySelect = ({ control, name, label, options, error, required,disabled }) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-[#233955] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required && `${label} is required` }}
        render={({ field }) => (
          <select
            {...field}
            id={name}
             disabled={disabled}

            className={`w-full px-4 py-3 rounded-xl border-2 ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-100 transition-colors bg-white`}
          >
            
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default PrimarySelect;
