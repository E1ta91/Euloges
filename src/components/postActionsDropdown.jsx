import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

const PostActionsDropdown = ({ postId, onDelete, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(postId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-gray-100 p-1 rounded-full"
      >
        <BsThreeDots className='text-2xl'/>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => {
                onUpdate(postId);
                setIsOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Update Post
            </button>
            <button
              onClick={handleDelete}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              Delete Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostActionsDropdown;