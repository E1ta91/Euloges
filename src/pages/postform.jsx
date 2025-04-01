import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, Music } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const PostForm = () => {
  const [media, setMedia] = useState([]);
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const { user, loading } = useUser(); // Use the shared context

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const supportedMediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mpeg', 'audio/mp3'];

    // Check if files exceed the limit
    if (files.length + media.length > 4) {
      alert("You can only upload up to 4 files.");
      return;
    }

    const mediaUrls = files
      .filter(file => supportedMediaTypes.includes(file.type))
      .map(file => ({ url: URL.createObjectURL(file), type: file.type }));

    setMedia(prev => [...prev, ...mediaUrls]);
    adjustHeight();
  };

  const handleMediaRemove = (index) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + media.length * 100}px`;
    }
  };

  const openFileDialog = (type) => {
    fileInputRef.current.setAttribute('accept', type);
    fileInputRef.current.click();
  };

  return (
    <div className="lg:w-[50vw] md:w-[64.5vw] w-[90vw]   mx-auto bg-white p-3 border-none rounded-lg shadow-lg">

      <form className="space-y-4">

        <div className="flex space-x-3">
          <div className=" aspect-square w-14 h-14 sm:w-16 sm:h-16 md:w-16  md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24">
            <img
              src={user?.profilePicture || (user?.id && localStorage.getItem(`profilePicture_${user.id}`)) || '/default-avatar.png'}
              alt="Profile"
              className=" inset-0 w-full h-full rounded-full  object-cover border-2 border-white/80 shadow-sm"
            />
          </div>
          <div className="border border-[#7a7878] rounded-lg p-2 w-[36rem]   min-h-[12vh]  outline-none overflow-hidden ">

            <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                adjustHeight();
              }}
              className="w-full h-auto min-h-[50px] bg-white outline-none resize-none "
              placeholder="Write Something"
            >

            </textarea>

            {media.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {media.map((file, index) => (
                  <div key={index} className="relative w-[150px] h-[100px]">
                    {file.type.startsWith('image') && (
                      <img src={file.url} alt={`Selected ${index}`} className="w-full h-full object-cover rounded-md" />
                    )}
                    {file.type.startsWith('video') && (
                      <video controls src={file.url} className="w-full h-full object-cover rounded-md" />
                    )}
                    {file.type.startsWith('audio') && (
                      <audio controls src={file.url} className="w-full h-full rounded-md">
                        Your browser does not support the audio element.
                      </audio>
                    )}

                    <button
                      type="button"
                      onClick={() => handleMediaRemove(index)}
                      className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      X
                    </button>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        <div className="flex justify-end space-x-2 pr-6">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaChange}
              style={{ display: 'none' }}
              id="file-input"
              multiple
            />
            <label className="cursor-pointer" onClick={() => openFileDialog('audio/*')}>
              <Music className="w-5 h-5" />
            </label>
            <label className="cursor-pointer" onClick={() => openFileDialog('image/*')}>
              <Image className="w-5 h-5" />
            </label>
            <label className="cursor-pointer" onClick={() => openFileDialog('video/*')}>
              <Video className="w-5 h-5" />
            </label>

          </div>

          <button type="submit" className="w-12 h-7 bg-sky-500 text-white rounded-md">
            Post
          </button>
        </div>

      </form>


    </div>
  );
};

export default PostForm;
