import React, { useState } from 'react';
import { FaFacebook, FaWhatsapp, FaTwitter, FaInstagram, FaShare } from 'react-icons/fa';
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton } from 'react-share';

const ShareButton = ({ url, text }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" block">
      
      <button onClick={toggleDropdown} className="">
        <FaShare className="w-5 h-5 " />
      </button>


      {isOpen && (
        <div className=" bg-white border rounded-lg shadow-lg p-2  flex  space-x-4">
          <FacebookShareButton url={url} quote={text}>
            <div className="flex items-center space-x-2">
              <FaFacebook className="w-5 h-5 text-blue-600" />
             
            </div>
          </FacebookShareButton>
          <WhatsappShareButton url={url} title={text}>
            <div className="flex items-center space-x-2">
              <FaWhatsapp className="w-5 h-5 text-green-600" />
              
            </div>
          </WhatsappShareButton>
          <TwitterShareButton url={url} title={text}>
            <div className="flex items-center space-x-2">
              <FaTwitter className="w-5 h-5 text-blue-400" />
              
              
            </div>
          </TwitterShareButton>
         
        </div>
      )}
    </div>
  );
};

export default ShareButton;

