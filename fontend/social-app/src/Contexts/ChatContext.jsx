import React, { createContext, useState } from "react";
import moment from "moment";
import { uploadFile } from "../Api/File/File";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const sendMessage = async (stompClient, selectedChat, user, newMessage, updateMessages, updateChatList, setNewMessage) => {
        const type = selectedFile ? "previewImage" : "TEXT";
        let messageRequest = {
            chatId: selectedChat.id,
            senderId: user?.id,
            receiverId: user?.id === selectedChat.senderId ? selectedChat.receiverId : selectedChat.senderId,
            type,
            urlpreviewImage: null, // Mặc định là null
        };

        if (selectedFile) {
            try {
                const response = await uploadFile({ file: selectedFile }); // Gửi selectedFile lên server
                const urlpreviewImage = response.data; // Giả sử response.data chứa URL hoặc ID của ảnh
                messageRequest.urlpreviewImage = urlpreviewImage; // Gán URL ảnh vào urlpreviewImage
                sendViaWebSocket(messageRequest, stompClient, selectedChat, user, newMessage, updateMessages, updateChatList, setNewMessage);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        } else {
            messageRequest.content = newMessage;
            sendViaWebSocket(messageRequest, stompClient, selectedChat, user, newMessage, updateMessages, updateChatList, setNewMessage);
        }
    };

    const sendViaWebSocket = (messageRequest, stompClient, selectedChat, user, newMessage, updateMessages, updateChatList, setNewMessage) => {
        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(messageRequest),
        });

        const newMsg = {
            id: Date.now(),
            text: selectedFile ? `previewImage: ${selectedFile.name}` : newMessage,
            sender: "Me",
            time: moment().format("hh:mm"),
            seen: false,
            urlpreviewImage: messageRequest.urlImage || null, // Thêm urlpreviewImage vào newMsg, null nếu không có ảnh
        };
        updateMessages(newMsg);
        updateChatList(selectedChat.id, newMessage || selectedFile?.name, Date.now(), 0);
        setNewMessage("");
        setSelectedFile(null);
        setPreviewImage(null);
    };

    return (
        <ChatContext.Provider value={{ selectedFile, setSelectedFile, previewImage, setPreviewImage, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;