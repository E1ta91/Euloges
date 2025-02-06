import React, { useState, useRef } from 'react';
import { Image, Video, Music } from 'lucide-react';

const PostForm = () => {
  const [media, setMedia] = useState([]);
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

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
    <div className="w-[50vw] mx-auto bg-white p-3 border-none rounded-lg shadow-lg">
      <form className="space-y-4">
        <div className="flex space-x-5">
          <h1 style={{ fontFamily: 'Playfair' }} className="border w-12 h-12 pt-2 text-xl bg-sky-400 outline-none border-none font-semibold text-center rounded-full">
            P
          </h1>

          <div className="border border-[#7a7878] rounded-lg p-2 w-[36rem] min-h-[12vh] bg-white outline-none overflow-hidden relative">
             <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                adjustHeight();
              }}
              className="w-full h-auto min-h-[50px] bg-transparent outline-none resize-none"
              placeholder="Write Something"
            ></textarea>

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
