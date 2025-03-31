import React, { useState } from 'react';
import h1 from '../assets/images/h1.jpg';
import SignInModal from '../components/signinModal';
import SignUpModal from '../components/signupModal';

const LandingPage = () => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const handleOpenSignInModal = () => {
        setIsSignInModalOpen(true);
        setIsSignUpModalOpen(false);
    };

    const handleOpenSignUpModal = () => {
        setIsSignUpModalOpen(true);
        setIsSignInModalOpen(false);
    };

    const handleCloseModals = () => {
        setIsSignInModalOpen(false);
        setIsSignUpModalOpen(false);
    };

    const handleSignupSuccess = () => {
        setIsSignUpModalOpen(false);
        setIsSignInModalOpen(true);
    };

    return (
        <div className='bg-black min-h-screen flex flex-col md:flex-row items-center xl:pl-44  md:pr-16  lg:space-x-16 md:pt-1 overflow-hidden'>
            <div className='mb-10 md:mb-0'>
                <img src={h1} alt="img" className='w-full md:w-2xl lg:w-[500px] ' />
            </div>

            <div className='space-y-8 text-center md:text-left  '>
                <h1 className='font-bold text-white text-2xl md:text-2xl lg:text-5xl xl:text-6xl'>Remembering Loved Ones</h1>
                <p className='text-white text-sm md:text-md lg:text-xl'>
                    An online space to share memories, <br />
                    offer condolences, and support each <br />
                    other during times of loss.
                </p>

                <div className='space-y-3'>
                    <div className='space-y-2'>
                        <p className='text-sm md:text-base text-white font-bold'>Already have an account?</p>
                        <button onClick={handleOpenSignInModal} className='text-[#28b4f5] border w-56 md:w-64 lg:w-72 border-gray-600 h-9 md:h-10 rounded-full hover:bg-slate-900 font-semibold text-sm md:text-base'>
                            Sign in
                        </button>
                        <SignInModal isOpen={isSignInModalOpen} onClose={handleCloseModals} />
                    </div>

                    <div className="flex items-center  md:justify-start w-56 md:w-64 mx-[7rem] md:mx-[0.1rem] lg:w-72">
                        <hr className="flex-1 border-gray-600" />
                        <span className="mx-2 text-white text-sm md:text-base">or</span>
                        <hr className="flex-1 border-gray-600" />
                    </div>

                    <div className='space-y-3'>
                        <button onClick={handleOpenSignUpModal} className='text-white bg-[#28b4f5] font-semibold w-56 md:w-64 lg:w-72 h-9 md:h-10 rounded-full text-sm md:text-base'>
                            Create an account
                        </button>
                        <SignUpModal isOpen={isSignUpModalOpen} onClose={handleCloseModals} onSignupSuccess={handleSignupSuccess} />

                        <p className='text-gray-600 text-xs md:text-sm'>
                            By signing up, you agree to the <a href="" className='text-[#28b4f5]'>Terms of Service</a> <br /> and <a href="" className='text-[#28b4f5]'>Privacy Policy</a>, including <a href="" className='text-[#28b4f5]'>Cookie Use.</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;