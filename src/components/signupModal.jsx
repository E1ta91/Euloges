import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useState } from "react";

const SignUpModal = ({ isOpen, onClose,  onSignupSuccess  }) => {
  const [usePhone, setUsePhone] = useState(false);
  const [step, setStep] = useState(1);
  
  if (!isOpen) return null;

  const handleSignup = () => {
      console.log("Signup successful!");
      onSignupSuccess(); // Switch to SignIn modal
  };
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-white/30">

          <div className="bg-black p-6 border border-white rounded-2xl space-y-6 shadow-lg w-[38vw] h-[80vh]">

            <h1 className="text-white text-center text-5xl" style={{ fontFamily: 'fleur' }}>E</h1>

            <form className="text-white flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold mb-4">Create Your Account</h2>

              {step === 1 && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-[22rem] h-12 p-2 border border-gray-600 rounded-md"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="mb-4 flex flex-col">

                    <label className="block text-sm font-medium">
                      {usePhone ? "Phone Number" : "Email"}
                    </label>

                    <input
                      type={usePhone ? "tel" : "email"}
                      name="emailOrPhone"
                      className="w-[22rem] h-12 p-2 border border-gray-600 rounded-md"
                      placeholder={usePhone ? "Enter your phone number" : "Enter your email"}
                    />

                    <button
                      type="button"
                      className="text-sm text-blue-400 mt-2 pl-[10rem]"
                      onClick={() => setUsePhone(!usePhone)}
                    >
                      {usePhone ? "Use email instead" : "Use phone number instead"}
                    </button>

                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Date of Birth</label>
                    <input
                      type="date"
                      name="date"
                      className="w-[22rem] h-12 p-2 border border-gray-600 rounded-md"
                      placeholder="Enter your birth date"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="  text-white rounded-md" >
                    <ArrowRight/>
                  </button>
                </>
              )}


              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="w-[22rem] h-12 p-2 border border-gray-600 rounded-md"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-[22rem] h-12 p-2 border border-gray-600 rounded-md"
                      placeholder="Confirm your password"
                    />

                  </div>
                  <div className="flex flex-col justify-center space-y-20 items-center w-full">
                    
                    <button type="submit" onClick={handleSignup} className="w-40 h-8 bg-[#28b4f5] font-semibold text-black p-1 rounded-full">
                      Sign Up
                    </button>

                    <button
                      type="button"
                      onClick={prevStep}
                      className=" text-white "
                    >
                      <ArrowLeft/>
                    </button>
                  </div>

                  
                </>
              )}
            </form>
            <button onClick={onClose} className="mt-4 text-gray-600 absolute top-16 mr-[27rem]">
              <X className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpModal;
