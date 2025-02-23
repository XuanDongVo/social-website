import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { api } from '../Api/Api';
import './ChatArea.css';
import { findById, createChat } from '../Api/Chat/Chat';
import { getMessagesByChatId } from '../Api/Message/Message';

const ChatArea = ({ chatId, receiverId, name }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClientRef = useRef(null); // Tham chiếu tới WebSocket client
    const currentUserId = localStorage.getItem('id'); // Lấy userId của người dùng hiện tại (authentication)
    const chatWindowRef = useRef(null);


    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);



    useEffect(() => {
        const fetchChat = async () => {
            try {
                console.log("chatId" + chatId);
                const response = await findById(chatId);
                console.log(response.data);

                const chat = response.data;

            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        };

        fetchChat();
    }, [chatId]);

    // Kết nối WebSocket khi component mount
    useEffect(() => {
        if (!chatId) return; // Nếu chưa có chatId, không thực hiện kết nối WebSocket

        const socket = new SockJS('http://localhost:8080/ws'); // URL của WebSocket endpoint
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('WebSocket connected');
                // Subscribe to the chat topic
                stompClient.subscribe(`/user/${currentUserId}/chat`, (message) => {
                    const messageBody = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, messageBody]);
                });
            },
            onDisconnect: () => console.log('WebSocket disconnected'),
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        // Cleanup khi component unmount
        return () => {
            stompClient.deactivate();
        };
    }, [chatId]); // Kết nối lại khi chatId thay đổi

    // Gửi message qua WebSocket
    const sendMessage = () => {
        if (newMessage.trim() && chatId) {
            const messagePayload = {
                content: newMessage,
                senderId: currentUserId,
                receiverId: receiverId,
                type: 'TEXT',
                chatId: chatId,
            };

            // Gửi message qua WebSocket
            stompClientRef.current.publish({
                destination: `/app/chat/${chatId}`, // Endpoint gửi tin nhắn tới WebSocket
                body: JSON.stringify(messagePayload),
            });

            // Cập nhật UI tạm thời
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...messagePayload,
                    sender: 'You',
                    createdAt: new Date().toISOString(), // Tạo thời gian gửi tạm thời
                    state: 'SENT', // Trạng thái tạm thời
                },
            ]);
            setNewMessage(''); // Xóa tin nhắn sau khi gửi
        }
    };

    // // Gọi API để tạo hoặc lấy chatId khi userId thay đổi
    // useEffect(() => {
    //     const fetchChatId = async () => {
    //         try {
    //             const response = await api.post(`/api/v1/chats?sender-id=${currentUserId}&receiver-id=${userId}`);
    //             setChatId(response.data.response); // Lưu chatId từ backend
    //         } catch (error) {
    //             console.error("Error fetching chatId:", error);
    //         }
    //     };

    //     if (userId && currentUserId) {
    //         fetchChatId(); // Fetch chatId khi userId hoặc currentUserId thay đổi
    //     }
    // }, [userId, currentUserId]);


    useEffect(() => {
        const fetchMessages = async () => {
            if (chatId) {
                try {
                    // Lấy tin nhắn từ phía sender
                    let response = await getMessagesByChatId(chatId);
                    const senderMessages = response.data;

                    if (senderMessages.length === 0) return;

                    // Lấy tin nhắn từ phía receiver
                    response = await createChat(receiverId, currentUserId);
                    response = await getMessagesByChatId(response.data.response);
                    const receiverMessages = response.data;
                    if (receiverMessages.length === 0) return;

                    // Hợp nhất và sắp xếp theo thời gian
                    const allMessages = [...senderMessages, ...receiverMessages].sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );

                    setMessages(allMessages); // Cập nhật state messages
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages(); // Gọi fetchMessages khi chatId thay đổi
    }, [chatId]);


    return (
        <div className="chat-container p-3" style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <h4>Chat with {name}</h4>

            {/* Chat window */}
            <div
                ref={chatWindowRef}
                className="chat-window"
                style={{
                    height: '400px',
                    overflowY: 'scroll',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message-box ${message.senderId === currentUserId ? 'self' : 'friend'}`}
                    >
                        <div className="message-content">
                            {message.type === 'MESSAGE' || message.type === "TEXT" ? (
                                <p>{message.content}</p>
                            ) : (
                                <img src={`data:image/jpg;base64,${message.media}`} alt="media" width="200" />
                            )}
                            <small className="message-time">
                                {new Date(message.createdAt).toLocaleTimeString()}
                            </small>
                            {message.senderId === currentUserId && message.state === 'SENT' && (
                                <i className="fas fa-check seen"></i>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input area */}
            <InputGroup className="mt-3">
                <FormControl
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onFocus={() => { }}
                />
                <Button variant="primary" onClick={() => sendMessage(newMessage)}>
                    Send
                </Button>
            </InputGroup>
        </div>
    );
};

export default ChatArea;
