import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogIn } from "../services/auth";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Loader from "./loader";
import { useUser } from "../context/UserContext";

const SignInModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userid, setUserid] = useState(null); // Store user ID
  const { fetchUser } = useUser(); // Get fetchUser from context
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    reValidateMode: "onBlur",
    mode: "all",
  });

  // Store token in localStorage
  // const addToLocalStorage = (accessToken) => {
  //   localStorage.setItem("accessToken", accessToken);
  // };

  // Fetch user details using the stored access token
  // const fetchUser = async () => {
  //   const token = localStorage.getItem("accessToken");
  //   if (!token) return;
  
  //   try {
  //     const response = await fetch("https://euloges.onrender.com/getUser", {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     const user = await response.json();
  //     console.log("User ID:", user.id);
  //     console.log("user", user)
  //     setUserid(user.id); // Store in state
  //     localStorage.setItem("userId", user.id); // Store in localStorage
  
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //   }
  // };
  

  // Handle Login
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiLogIn({
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      await fetchUser(); // Critical: Wait for user data to load
      toast.success(res.data.message);
      navigate("/main"); // Redirect AFTER data is ready
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="signin">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 p-4">
          <div className="bg-black border border-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm sm:max-w-sm md:max-w-sm lg:max-w-md h-auto min-h-[400px] relative">
            <button onClick={onClose} className="absolute top-4 right-4">
              <X className="text-white w-6 h-6" />
            </button>
            <h1 className="text-white text-center text-5xl sm:text-6xl" style={{ fontFamily: "fleur" }}>
              E
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center space-y-4">
              <h2 className="text-lg sm:text-xl text-white font-semibold">Sign into Euloges</h2>
              <div className="w-full flex justify-center">
                <div className="w-full sm:w-80 md:w-72 lg:w-80">
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                  <label className="block text-sm sm:text-base text-white text-start font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 border rounded-sm border-gray-600 text-gray-200 bg-black"
                    placeholder="Enter your email"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
              </div>
              <div className="w-full flex justify-center">
                <div className="w-full sm:w-80 md:w-72 lg:w-80">
                  <label className="block text-sm sm:text-base font-medium text-start text-white">Password</label>
                  {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                  <input
                    type="password"
                    id="password"
                    autoComplete="password"
                    className="w-full p-2 border border-gray-600 text-gray-200 rounded-sm bg-black"
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  />
                  <a href="#" className="text-sm sm:text-base text-white hover:underline block text-right mt-2">
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div className="w-56 sm:w-60 md:w-60 lg:w-56">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center h-10 sm:h-9 bg-[#28b4f5] font-semibold text-black rounded-full"
                >
                  {isSubmitting ? <Loader /> : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInModal;
