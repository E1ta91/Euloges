import React, { useState } from 'react';
import h1 from '../assets/images/h1.jpg';
import SignInModal from '../components/signinModal';
import SignUpModal from '../components/signupModal';

const LandingPage = () => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const handleOpenSignInModal = () => {
        setIsSignInModalOpen(true);
        setIsSignUpModalOpen(false); // Close the signup modal if it's open
    };

    const handleOpenSignUpModal = () => {
        setIsSignUpModalOpen(true);
        setIsSignInModalOpen(false); // Close the sign-in modal if it's open
    };

    const handleCloseModals = () => {
        setIsSignInModalOpen(false);
        setIsSignUpModalOpen(false);
    };

    //  Function to switch from SignUp to SignIn modal after successful signup
    const handleSignupSuccess = () => {
        setIsSignUpModalOpen(false);
        setIsSignInModalOpen(true);
    };

    return (
        <div className='bg-black h-[100vh] flex space-x-24 pl-44 pt-24'>
            <div>
                <img src={h1} alt="img" className='w-[450px]' />
            </div>

            <div className='space-y-10'>
                <h1 className='font-bold text-white text-5xl'>Remembering Loved Ones</h1>
                <p className='text-white text-xl'>
                    An online space to share memories, <br />
                    offer condolences, and support each <br />
                    other during times of loss.
                </p>

                <div className='space-y-3'>
                    <div className='space-y-2'>
                        <p className='text-md text-white font-bold'>Already have an account?</p>
                        <button onClick={handleOpenSignInModal} className='text-[#28b4f5] border w-80 border-gray-600 h-10 rounded-full hover:bg-slate-900 font-semibold'>
                            Sign in
                        </button>
                        <SignInModal isOpen={isSignInModalOpen} onClose={handleCloseModals} />
                    </div>

                    <div className="flex items-center ml-1 w-[23vw]">
                        <hr className="flex-1 border-gray-600" />
                        <span className="mx-2 text-white">or</span>
                        <hr className="flex-1 border-gray-600" />
                    </div>

                    <div className='space-y-1'>
                        <button onClick={handleOpenSignUpModal} className='text-white bg-[#28b4f5] font-semibold w-80 h-10 rounded-full'>
                            Create an account
                        </button>
                        
                        {/*  Pass `handleSignupSuccess` as a prop to switch to SignIn */}
                        <SignUpModal isOpen={isSignUpModalOpen} onClose={handleCloseModals} onSignupSuccess={handleSignupSuccess} />

                        <p className='text-gray-600 text-xs'>
                            By signing up, you agree to the <a href="" className='text-[#28b4f5]'>Terms of Service</a> and <a href="" className='text-[#28b4f5]'>Privacy Policy</a>, including <a href="" className='text-[#28b4f5]'>Cookie Use.</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
