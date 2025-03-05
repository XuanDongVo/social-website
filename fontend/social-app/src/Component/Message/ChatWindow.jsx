import React, { useContext } from "react";
import { Box, Paper, Typography, Avatar, Button } from "@mui/material";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";

const ChatWindow = ({ selectedChat, messages, onSendMessage, newMessage, setNewMessage }) => {
    const { user } = useContext(AuthContext);

    return (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "90vh", p: 0 }}>
            {selectedChat ? (
                <>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderBottom: "1px solid #ddd",
                            backgroundColor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar alt={selectedChat.name} src={selectedChat.avatar} sx={{ width: 40, height: 40 }} />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="500">
                                    {selectedChat.name}
                                </Typography>
                                {selectedChat.active && (
                                    <Typography variant="caption" color="green">
                                        Active now
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Link to={`/profile/${user.id === selectedChat.senderId ? selectedChat.senderId : selectedChat.receiverId}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <Button variant="text" color="primary">
                                View profile
                            </Button>
                        </Link>
                    </Paper>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            p: 2,
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            flexDirection: "column-reverse",
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            {messages.map((message, index) => (
                                <MessageBubble key={message.id} message={message} isLastMessageFromMe={index === messages.length - 1 && message.sender === "Me"} />
                            ))}
                        </Box>
                    </Box>
                    <ChatInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        onSendMessage={onSendMessage}
                    />
                </>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", backgroundColor: "#fff" }}>
                    <Typography variant="h6" color="text.secondary">
                        Select a chat to start messaging
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ChatWindow;