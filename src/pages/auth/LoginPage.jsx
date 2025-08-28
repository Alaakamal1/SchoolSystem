import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PrimaryButton from "../../core/components/PrimaryButton";
import schoolImage from "/school.jpg";
import { apiClient } from "../../core/utils/apiClient";
import LoginInput from "../../core/components/LoginInput";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const res = await apiClient.post("/login", data);

      console.log("✅ Full login response:", res.data);

      if (res.data && res.data.status === "success") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user_info.role);
        localStorage.setItem("user", JSON.stringify(res.data.user_info));
        console.log("role", res.data.user_info.role);
        if (res.data.user_info.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res.data.user_info.role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (res.data.user_info.role === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Invalid login response format");
      }
    } catch (err) {
      setError(err.message || "Login failed, try again");
      console.error("Validation errors:", err.response.data.errors);
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
              <LoginInput
                label="Email"
                name="email"
                type="email"
                // autoComplete="email"
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

              <LoginInput
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
