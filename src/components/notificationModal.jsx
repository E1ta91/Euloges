import { X } from "lucide-react";
import React from "react";
import K from "../constants";

const NotificationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 h-full flex items-center justify-center z-50">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            {/* Modal content */}
            <div className="relative text-white hover:text-white border border-white bg-black p-5 rounded-xl shadow-lg w-[90vw] md:w-[60vw] lg:w-[40vw] h-[80vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 ">
                    <X size={24} />
                </button>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                    <ul className="space-y-2">
                        {K.NOTIFICATIONS.map((notification) => (
                            <li key={notification.id} className="flex items-center space-x-3 py-2">
                                <img src={notification.avatar} alt={notification.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <strong>{notification.name}</strong> {notification.message}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
