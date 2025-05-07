import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, Music, Loader } from 'lucide-react';
import { useUser } from '../context/UserContext';

const PostForm = ({ onNewPost }) => {
  const [media, setMedia] = useState(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

  const [profilePicture, setProfilePicture] = useState('');
  const [success, setSuccess] = useState(false);
  const { user, loading } = useUser(); // Get user and loading from context

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) throw new Error('No access token available');

        const response = await fetch('https://euloges.onrender.com/getUser', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile picture');
        const data = await response.json();
        setProfilePicture(data.url);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setProfilePicture('/default-profile.jpg');
      }
    };

    fetchProfilePicture();
  }, []);

  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "system_uploader_1e2ddab171f769b9_caf3eb7651095f0378783f931ea2e955e8");
      formData.append("folder", "posts");

      const response = await fetch("https://api.cloudinary.com/v1_1/dhywsn6jz/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Cloudinary raw result:", result);

      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || "Upload failed");
      }

      return { url: result.secure_url };
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken || !user?.id) {
            throw new Error("Authentication required");
        }

        let uploadUrl = "";

        if (media?.file) {
            const result = await uploadToCloudinary(media.file);
            uploadUrl = result.url;
            console.log("Uploaded media URL:", uploadUrl);

            if (!uploadUrl) {
                throw new Error("File upload failed. No URL received from Cloudinary.");
            }
        }

        const postData = {
            user: user.id,
            content: text || "",
            uploadUrl: uploadUrl,
        };

        if (uploadUrl && media?.type?.startsWith("audio")) {
            postData.music = [{
                url: uploadUrl,
                addedBy: user.id,
                uploadedAt: new Date().toISOString(),
                duration: 0,
            }];
        }

        console.log("Post data being sent:", postData);

        const response = await fetch("https://euloges.onrender.com/add-post", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        const responseText = await response.text(); // Read raw response text
        console.log("Raw response:", responseText);

        if (!response.ok) {
            throw new Error(`Failed to create post: ${responseText}`);
        }

        const result = JSON.parse(responseText); // Parse JSON if valid
        console.log("Post created successfully:", result);

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        if (onNewPost) {
            onNewPost({...result, userData: {  ...user, profilePicture: profilePicture,  },
                createdAt: new Date().toISOString(),
            });
        }

        setText("");
        setMedia(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
        console.error("Submission error:", err);
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
};

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'image/png', 'image/jpg', 'image/jpeg',
      'video/mp4', 'audio/mpeg', 'application/pdf'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type');
      return;
    }

    setMedia({
      url: URL.createObjectURL(file),
      type: file.type,
      file
    });
    adjustHeight();
  };

  const handleMediaRemove = () => {
    if (media?.url) URL.revokeObjectURL(media.url);
    setMedia(null);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const openFileDialog = (type) => {
    fileInputRef.current.accept = type;
    fileInputRef.current.click();
  };

  return (
    <div className="lg:w-[50vw] md:w-[64.5vw] w-[90vw] mx-auto bg-white p-3 border-none rounded-lg shadow-lg">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex space-x-3">


          <div className="aspect-square w-14 h-14 md:h-16 md:w-16">
            {loading ? (
              <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img
                src={user?.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
              />
            )}
          </div>


          <div className="border border-[#7a7878] rounded-lg p-2 w-[36rem] min-h-[12vh] outline-none overflow-hidden">
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                adjustHeight();
              }}
              className="w-full h-auto min-h-[50px] bg-white outline-none resize-none"
              placeholder="Write Something"
            />
            {media && (
              <div className="pt-2">
                {media.type.startsWith('image') && (
                  <div className="relative">
                    <img
                      src={media.url}
                      alt="Preview"
                      className="max-w-full max-h-64 object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleMediaRemove}
                      className="absolute top-2 right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}

                {media.type.startsWith('video') && (
                  <div className="relative">
                    <video
                      controls
                      src={media.url}
                      className="max-w-full max-h-64 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleMediaRemove}
                      className="absolute top-2 right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}

                {media.type.startsWith('audio') && (
                  <div className="relative">
                    <audio controls src={media.url} className="w-full" />
                    <button
                      type="button"
                      onClick={handleMediaRemove}
                      className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center space-x-3">
          <div className="flex items-center space-x-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => openFileDialog('audio/*')}
              disabled={isUploading}
              className="p-1 rounded disabled:opacity-50"
              title="Add audio"
            >
              {isUploading && media?.type.startsWith('audio') ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Music className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => openFileDialog('image/*')}
              disabled={isUploading}
              className="p-1 rounded disabled:opacity-50"
              title="Add image"
            >
              {isUploading && media?.type.startsWith('image') ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Image className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => openFileDialog('video/*')}
              disabled={isUploading}
              className="p-1 rounded"
              title="Add video"
            >
              {isUploading && media?.type.startsWith('video') ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Video className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading || (!text && !media)}
            className="w-20 h-8 bg-sky-500 text-white rounded-md flex items-center justify-center "
          >
            {isSubmitting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : 'Post'}
          </button>
        </div>

        {success && (
          <div className="text-green-500 text-sm mt-2 text-center">
            ✓ Post created successfully!
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-2 text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;