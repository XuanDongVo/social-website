import React, { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import ChatSidebar from "../Component/Message/ChatSidebar";
import ChatWindow from "../Component/Message/ChatWindow";
import { AuthContext } from "../Contexts/AuthContext";
import { getAllChats } from "../Api/Chat/Chat";
import { getMessagesByChatId, setMessageToSeen } from "../Api/Message/Message";
import moment from "moment";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { uploadFile } from "../Api/File/File";

const ChatInterfacePage = () => {
    const { user } = useContext(AuthContext);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stompClient, setStompClient] = useState(null);


    // Fetch danh sách chat khi component mount
    useEffect(() => {
        const fetchChatList = async () => {
            try {
                if (user?.id) {
                    const response = await getAllChats(user.id);
                    setChatList(response.data);
                }
            } catch (error) {
                console.error("Error fetching chat list:", error);
            }
        };
        fetchChatList();
    }, [user?.id]);


    useEffect(() => {
        const fetchMessagesAndSetupWebSocket = async () => {
            if (selectedChat) {
                setLoading(true);
                try {
                    // Fetch tin nhắn ban đầu qua REST API
                    const response = await getMessagesByChatId(selectedChat.id);
                    setMessages(
                        response.data.map((msg) => ({
                            id: msg.id,
                            text: msg.content,
                            sender: msg.senderId === user?.id ? "Me" : selectedChat.name,
                            time: moment(msg.createdAt).format("hh:mm"),
                            seen: msg.state === "SEEN",
                            urlImage: msg.urlImage
                        })).sort((a, b) => new Date(b.time) - new Date(a.time))
                    );

                    // Gọi API để đánh dấu tin nhắn đã đọc khi lần đầu mở chat
                    await setMessageToSeen(selectedChat.id);

                    // Khởi tạo WebSocket với SockJS
                    const socket = new SockJS("http://localhost:8080/ws");
                    const client = new Client({
                        webSocketFactory: () => socket,
                        reconnectDelay: 5000,
                        onConnect: () => {
                            console.log("✅ Connected to WebSocket via SockJS");
                            client.subscribe(`/user/${user.id}/chat`, (message) => {
                                const notification = JSON.parse(message.body);
                                if (notification.chatId === selectedChat.id) {
                                    if (notification.notificationType === "SEEN") {
                                        // Cập nhật trạng thái seen cho các tin nhắn đã gửi
                                        setMessages((prev) =>
                                            prev.map((msg) =>
                                                msg.sender === "Me" && msg.content !== null
                                                    ? { ...msg, seen: true }
                                                    : msg
                                            )
                                        );
                                    } else {
                                        // Tin nhắn mới
                                        const newMessage = {
                                            id: notification.id,
                                            text: notification.content,
                                            sender: notification.senderId === user?.id ? "Me" : selectedChat.name,
                                            time: moment(notification.createdAt || Date.now()).format("hh:mm"),
                                            seen: false, // Mặc định chưa đọc
                                            urlImage: notification.urlImage
                                        };

                                        setMessages((prev) => [...prev, newMessage].sort((a, b) => new Date(b.time) - new Date(a.time)));

                                        if (notification.senderId !== user?.id) {
                                            setMessageToSeen(selectedChat.id).catch((error) =>
                                                console.error("Error marking message as seen:", error)
                                            );
                                        }

                                        // Cập nhật chatList cho tin nhắn mới
                                        setChatList((prev) =>
                                            prev.map((chat) =>
                                                chat.id === notification.chatId
                                                    ? {
                                                        ...chat,
                                                        lastMessage: notification.content,
                                                        lastMessageTime: notification.createdAt || Date.now(),
                                                        unReadCount: chat.id !== selectedChat.id
                                                            ? (notification.notificationType === "SEEN" ? 0 : chat.unReadCount + 1)
                                                            : 0,
                                                        senderId: notification.senderId
                                                    }
                                                    : chat
                                            ).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                                        );
                                    }
                                }
                            });
                        },
                        onDisconnect: () => console.log("❌ Disconnected from WebSocket"),
                        onStompError: (frame) => console.error("⚠️ WebSocket error:", frame),
                    });

                    client.activate();
                    setStompClient(client);

                    return () => {
                        if (client.active) {
                            client.deactivate();
                        }
                    };
                } catch (error) {
                    console.error("❌ Error fetching messages or setting up WebSocket:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMessagesAndSetupWebSocket();
    }, [selectedChat, user?.id]);

    // Gửi tin nhắn qua WebSocket STOMP
    const handleSendMessage = async (selectFile) => {
        if (newMessage.trim() && selectedChat && stompClient?.active) {
            setLoading(true);
            let urlImage = null;
            if (selectFile) {
                const response = await uploadFile({ files: [selectFile] });
                urlImage = response.data[0];
            }
            try {
                const messageRequest = {
                    chatId: selectedChat.id,
                    content: newMessage,
                    senderId: user?.id,
                    receiverId: user?.id === selectedChat.senderId ? selectedChat.receiverId : selectedChat.senderId,
                    type: selectFile ? "IMAGE" : "TEXT",
                    urlImage: urlImage
                };

                stompClient.publish({
                    destination: "/app/chat",
                    body: JSON.stringify(messageRequest),
                });

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        text: newMessage,
                        sender: "Me",
                        time: moment().format("hh:mm"),
                        seen: false,
                        urlImage: urlImage
                    },
                ].sort((a, b) => new Date(b.time) - new Date(a.time)));

                setChatList((prev) =>
                    prev.map((chat) =>
                        chat.id === selectedChat.id
                            ? {
                                ...chat,
                                lastMessage: newMessage,
                                lastMessageTime: Date.now(),
                                unReadCount: 0,
                            }
                            : chat
                    ).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                );

                setNewMessage("");
            } catch (error) {
                console.error("Error sending message via WebSocket:", error);
            } finally {
                setLoading(false);
            }
        } else {
            console.warn("WebSocket not connected or no message to send");
        }
    };

    return (
        <Box sx={{
            p: 0,
            display: "flex",
            minHeight: "100vh", // Sử dụng minHeight để tránh che navigation

        }}>
            <ChatSidebar chatList={chatList} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
            <ChatWindow
                selectedChat={selectedChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                loading={loading}
            />
        </Box>
    );
};


export default ChatInterfacePage;