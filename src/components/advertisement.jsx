import React from 'react'
import ad from '../assets/images/ad1.png';
import ad1 from '../assets/images/ad2.png';

const Advertisement = () => {
  return (
    <div className="   md:flex md:flex-col  mx-5 md:mx-0  space-y-7  items-center md:items-start  md:pt-6  lg:pt-7 xl:pt-7 ">

            <h1 style={{ fontFamily: "playfair" }} className="text-xl pt-4   md:text-left">
              Advertisement
            </h1>

            <div className="md:space-y-10 space-x-2 flex md:flex md:flex-col">
              <img className="w-[140px] md:w-[27vw] lg:w-[240px] xl:w-[300px] rounded-lg shadow-lg" src={ad} alt="" />
              <img className="w-[140px] md:w-[27vw] lg:w-[240px] xl:w-[300px] rounded-lg shadow-lg" src={ad1} alt="" />
            </div>

            <div className="bg-white hidden md:flex w-[20vw] xl:w-[300px] md:w-[25vw] h-[60vh] lg:w-[24vw]   rounded-lg">
              <h1 style={{ fontFamily: "playfair" }} className="text-black text-2xl text-center pt-2">
                Live on Euloges
              </h1>
            </div>
          </div>
  )
}

export default Advertisement