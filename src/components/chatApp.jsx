import { useState } from "react";
import { Send } from "lucide-react";

const users = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3" },
];

const ChatApp = ({ isOpen, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState({
    1: [{ text: "Hey Alice!", sender: "me" }],
    2: [{ text: "Hey Bob, how's it going?", sender: "me" }],
    3: [{ text: "Charlie, long time no see!", sender: "me" }],
  });

  if (!isOpen) return null; // Don't render if closed

  return (
    <div className="fixed  flex items-center justify-center h-full zzzzzz bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] h-[500px] relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute bottom-3 right-2 text-gray-600">
          ✕
        </button>

        {/* Chat UI */}
        <div className="flex h-full">
          {/* Contacts List */}
          <div className="w-1/3 bg-gray-100 p-2 border-r">
            <h3 className="text-sm font-semibold mb-2">Chats</h3>
            {users.map((user) => (
              <div key={user.id} className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => setSelectedUser(user)}>
                <img src={user.avatar} className="w-8 h-8 rounded-full mr-2" alt="" />
                {user.name}
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex flex-col w-2/3">
            {selectedUser ? (
              <>
                <div className="p-3 bg-indigo-600 text-white font-semibold">{selectedUser.name}</div>

                <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                  {(chats[selectedUser.id] || []).map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg ${msg.sender === "me" ? "bg-indigo-500 text-white self-end" : "bg-gray-200"}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="p-2 flex border-t">
                  <input type="text" className="flex-1 p-2 border rounded-lg" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  <button className="ml-2 p-2 bg-indigo-600 text-white rounded-lg" onClick={() => sendMessage()}>
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">Select a user to start chatting</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
