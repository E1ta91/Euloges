import { X } from "lucide-react";

const DonateModal = ({isOpen, onClose}) => {
   
  return (
    <div >
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 p-4">
          <div className="bg-black border border-white p-6 rounded-2xl shadow-lg 
                          w-[90%] max-w-sm sm:max-w-sm md:max-w-sm lg:max-w-md 
                          h-auto min-h-[400px] relative">

            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4">
              <X className="text-white w-6 h-6" />
            </button>

            {/* Logo */}
            <h1 className="text-white text-center text-5xl sm:text-6xl" style={{ fontFamily: "fleur" }}>
              E
            </h1>

            <h2 className="text-lg sm:text-xl text-white font-semibold">Sign into Euloges</h2>

           
          </div>
        </div>
      )}
    </div>

  )
}

export default DonateModal