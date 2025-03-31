import { useState } from "react";
import { Send } from "lucide-react";

const users = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3" },
];

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({
    1: [{ text: "Hey Alice!", sender: "me" }],
    2: [{ text: "Hey Bob, how's it going?", sender: "me" }],
    3: [{ text: "Charlie, long time no see!", sender: "me" }],
  });
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    setChats((prevChats) => ({
      ...prevChats,
      [selectedUser.id]: [
        ...(prevChats[selectedUser.id] || []),
        { text: newMessage, sender: "me" },
      ],
    }));
    setNewMessage("");
  };

  return (
    <div className="flex h-[500px] w-[400px] border border-gray-300 rounded-lg shadow-lg bg-white">
      {/* Contacts List */}
      <div className="w-1/3 border-r p-2 bg-gray-100">
        <h3 className="text-sm font-semibold mb-2">Chats</h3>
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              selectedUser?.id === user.id ? "bg-indigo-300" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-2/3">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3 bg-indigo-600 text-white font-semibold flex items-center rounded-t-lg">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              {selectedUser.name}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {(chats[selectedUser.id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[70%] ${
                    msg.sender === "me"
                      ? "bg-indigo-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-2 flex items-center border-t">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg outline-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="ml-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={sendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
