import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PrimaryButton from "../../core/components/PrimaryButton";
import { UseAuth } from "../../core/context/UseAuth";
import schoolImage from "/school.jpg";
import PrimaryInput from "../../core/components/PrimaryInput";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = UseAuth();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src={schoolImage}
          alt="school background"
          className="h-screen w-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-8 shadow-md h-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-medium font-sans text-sky-700">
                Login
              </h2>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 rounded">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <PrimaryInput
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                register={register}
                error={errors.email}
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                }}
              />

              <PrimaryInput
                label="Password"
                name="password"
                type="password"
                autoComplete="password"
                required
                register={register}
                error={errors.password}
                validation={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />

              <PrimaryButton
                type="submit"
                hasIcon={false}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
