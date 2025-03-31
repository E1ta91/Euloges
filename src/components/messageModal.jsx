import { Send, X } from "lucide-react";
import React, { useState } from "react";
import K from "../constants";

const MessageModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [selectedUser, setSelectedUser] = useState(null);
    const [chats, setChats] = useState({
        1: [],
        2: [],
        3: [],
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
        <div className="fixed inset-0 flex items-center h-full justify-center p-4 sm:p-8">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            {/* Modal content */}
            <div className="relative w-full max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col md:flex-row rounded-2xl shadow-lg bg-black text-white overflow-hidden">
                <button onClick={onClose} className="absolute top-2 right-2 text-white">
                    <X size={24} />
                </button>

                {/* Contacts List */}
                <div className="w-full md:w-1/3 border-r border-white p-4 overflow-y-auto">
                    <h3 className="text-sm font-semibold mb-4">Chats</h3>
                    {K.USERS.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition ${selectedUser?.id === user.id ? 'bg-sky-400' : 'hover:bg-sky-400'}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                            <span className="text-md">{user.name}</span>
                        </div>
                    ))}
                </div>

                {/* Chat Window */}
                <div className="flex flex-col w-full md:w-2/3">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-sky-600 text-white font-semibold flex items-center">
                                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full mr-3" />
                                {selectedUser.name}
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {(chats[selectedUser.id] || []).map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg max-w-[75%] ${msg.sender === "me" ? "bg-white text-black self-end ml-auto" : "bg-gray-200 text-black"}`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="p-3 flex items-center border-t border-white">
                                <input
                                    type="text"
                                    className="flex-1 p-3 border border-white rounded-lg outline-none bg-black text-white"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <button className="ml-3 p-3 bg-sky-600 text-white rounded-lg" onClick={sendMessage}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-500 p-4 text-center">
                            Select a user to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
