import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiSignUp } from "../services/auth";
import { toast } from "react-toastify";
import Loader from "./loader";

const SignUpModal = ({ isOpen, onClose, onSignupSuccess }) => {
  const { register, handleSubmit, formState: { errors }, } = useForm({ reValidateMode: "onBlur", mode: "all" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const formatDateOfBirth = (dateString) => {
  const date = new Date(dateString);
    return date.toISOString();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('dateOfBirth', formatDateOfBirth(data.dateOfBirth));
    try {
      const res = await apiSignUp(formData);
      console.log("res", res.data);
      toast.success(res.data.message);
      onSignupSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during signup!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-full flex items-center justify-center bg-white/30 p-4">
      <div className="bg-black border border-white p-6 rounded-2xl shadow-lg w-[90%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md min-h-[450px] h-auto relative space-y-6">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="text-white w-6 h-6" />
        </button>

        <h1 className="text-white text-center text-5xl sm:text-6xl" style={{ fontFamily: "fleur" }}>
          E
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="text-white flex flex-col justify-center items-center space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">Create Your Account</h2>

          {step === 1 && (
            <>
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-xs text-left space-y-2">
                <label htmlFor="name" className="block text-sm sm:text-base font-medium">Name</label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-black text-gray-200"
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="w-full max-w-xs sm:max-w-sm md:max-w-xs space-y-2">
                <label htmlFor="email" className="block text-sm sm:text-base font-medium text-left">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-black text-gray-200"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="w-full max-w-xs sm:max-w-sm md:max-w-xs space-y-2">
                <label htmlFor="dateOfBirth" className="block text-sm sm:text-base font-medium text-left">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", { required: "Date of Birth is required" })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-black text-gray-200"
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center justify-center text-white rounded-full w-8 h-8 bg-[#28b4f5]"
              >
                <ArrowRight />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="w-72 max-w-xs sm:max-w-sm md:max-w-sm space-y-2">
                <label htmlFor="password" className="block text-sm sm:text-base text-start font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-black text-gray-200"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col justify-between items-center space-y-6 w-full pt-3 max-w-xs sm:max-w-sm md:max-w-md">
                <button
                  type="submit"
                  className="text-center xl:h-7 flex justify-center items-center w-28 h-9 bg-[#28b4f5] font-semibold text-black rounded-full"
                >
                  {isSubmitting ? <Loader /> : "Sign Up"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center text-white rounded-full w-8 h-8 bg-gray-600"
                >
                  <ArrowLeft />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;