// Socket configuration for real-time communication using Socket.IO
// This module initializes a socket connection, handles events, and provides methods to send and receive messages.

import socket  from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (!socketInstance) {
        
        socketInstance = socket(import.meta.env.VITE_API_URL, {
            auth: {
                token: localStorage.getItem("token"),
            },
            query: {
                projectId,
            }
        });

        // socketInstance.on("connect", () => {
        //     console.log("Socket connected:", socketInstance.id);
        // });

        // socketInstance.on("connect_error", (err) => {
        //     console.error("Socket connection error:", err);
        // });

        // socketInstance.on("disconnect", (reason) => {
        //     console.warn(`Socket disconnected: ${reason}`);
        // });
    }
    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
    if (!socketInstance) {
        console.error("Socket not initialized");
        return;
    }
    socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error("Socket not initialized");
        return;
    }
    socketInstance.emit(eventName, data);
};

// export const disconnectSocket = () => {
//     if (socketInstance) {
//         socketInstance.disconnect();
//         socketInstance = null;
//     }
// };
