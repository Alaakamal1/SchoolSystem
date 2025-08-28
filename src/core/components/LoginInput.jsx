const LoginInput = ({
  label,
  name,
  type = "text",
  register,
  validation,
  required,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-[#233955] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        type={type}
        className={`w-full px-4 py-3 rounded-xl border-2 ${
          error ? "border-red-500" : "border-gray-200"
        } focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 transition-colors`}
        {...register(name, validation)}  
        {...props}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default LoginInput;
