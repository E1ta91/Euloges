import { X } from "lucide-react";
import { Link } from "react-router-dom";



const SignInModal = ({ isOpen, onClose }) => {

    return (
        <div id="signin" >
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/20 ">

                    <div className="bg-black border border-white p-6 rounded-2xl space-y-5  shadow-lg w-[35vw] h-[70vh] ">

                        <h1 className="text-white text-center text-5xl " style={{fontFamily: 'fleur'}}>E</h1>
                        
                        

                        <form className="flex flex-col justify-center items-center">
                        <h2 className="text-xl text-white font-semibold mb-4">Sign into Euloges</h2>
                            <div className="mb-4">
                                <label className="block text-sm text-white font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-80 p-2 border rounded-sm border-gray-600 text-gray-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white">Password</label>
                                <input
                                    type="password"
                                    className="w-80 p-2 border border-gray-600 text-gray-200 rounded-sm"
                                    placeholder="Enter your password"
                                />

                                <a href="#" className="text-sm pl-[12rem]  text-white hover:underline mt-2 block">
                                    Forgot Password?
                                </a>
                            </div>



                        <Link to={'main'}>
                        <button type="submit" className="w-40 h-8 bg-[#28b4f5] font-semibold text-black p-1 rounded-full" >
                                Sign In
                             </button>
                        </Link>   
                         </form>

                         <button onClick={onClose} className="mt-4 text-gray-600 absolute top-24 mr-[27rem]">
                          <X className="text-white"/>
                         </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignInModal;