import React from "react";
import { Box, Paper, Typography, Avatar, Button } from "@mui/material";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatWindow = ({ selectedChat, messages, onSendMessage, newMessage, setNewMessage }) => {
    return (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "80vh", p: 0 }}>
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
                        <Button variant="text" color="primary">
                            View profile
                        </Button>
                    </Paper>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            p: 2,
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            flexDirection: "column-reverse", // Đảo ngược để tin mới nhất ở dưới
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
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