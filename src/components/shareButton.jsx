import React, { useEffect, useRef, useState } from 'react';
import { FaFacebook, FaWhatsapp,  FaTwitter,  FaShare,  FaLink } from 'react-icons/fa';
import {  FacebookShareButton, WhatsappShareButton, TwitterShareButton,  EmailShareButton } from 'react-share';

const ShareButton = ({ url, text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Share trigger button */}
      <button 
        onClick={toggleDropdown} 
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <FaShare className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex space-x-3 z-50">
          {/* Facebook */}
          <FacebookShareButton 
            url={url} 
            quote={text}
            className="hover:opacity-80 transition-opacity"
          >
            <FaFacebook className="w-6 h-6 text-blue-600" />
          </FacebookShareButton>

          {/* WhatsApp */}
          <WhatsappShareButton 
            url={url} 
            title={text}
            className="hover:opacity-80 transition-opacity"
          >
            <FaWhatsapp className="w-6 h-6 text-green-500" />
          </WhatsappShareButton>

          {/* Twitter */}
          <TwitterShareButton 
            url={url} 
            title={text}
            className="hover:opacity-80 transition-opacity"
          >
            <FaTwitter className="w-6 h-6 text-blue-400" />
          </TwitterShareButton>

          {/* Copy link */}
          <button 
            onClick={copyToClipboard}
            className="hover:opacity-80 transition-opacity"
          >
            <FaLink className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;