import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ChatSidebar from "../Component/Message/ChatSidebar";
import ChatWindow from "../Component/Message/ChatWindow";

const ChatInterfacePage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatList, setChatList] = useState([
        {
            id: 1,
            name: "Xuan Dong",
            avatar: "https://via.placeholder.com/40",
            lastMessage: "Hello",
            time: "12:10 PM",
            active: true,
        },
        {
            id: 2,
            name: "Nguyen Binh Anh",
            avatar: "https://via.placeholder.com/40",
            lastMessage: "kool~ 30w",
            time: "11:50 AM",
            active: false,
        },
        // Thêm danh sách bạn bè khác nếu cần
    ]);

    useEffect(() => {
        if (selectedChat) {
            setMessages([
                { id: 1, text: "Hello", sender: "Xuan Dong", time: "12:10 PM" },
                { id: 2, text: "Hello", sender: "Me", time: "12:10 PM" },
            ]);
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([
                ...messages,
                { id: messages.length + 1, text: newMessage, sender: "Me", time: new Date().toLocaleTimeString() },
            ]);
            setNewMessage("");
        }
    };

    return (
        <Box sx={{ display: "flex", height: "80vh", mt: 2 }}>
            <ChatSidebar
                chatList={chatList}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
            />
            <ChatWindow
                selectedChat={selectedChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
            />
        </Box>
    );
};

export default ChatInterfacePage;