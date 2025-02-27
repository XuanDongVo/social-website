import React from "react";
import { Box, Typography } from "@mui/material";

const MessageBubble = ({ message }) => {
    return (
        <Box
            sx={{
                maxWidth: "70%",
                p: 2,
                mb: 1,
                backgroundColor: message.sender === "Me" ? "#0084ff" : "#e9ecef",
                color: message.sender === "Me" ? "#fff" : "inherit",
                borderRadius: 8,
                alignSelf: message.sender === "Me" ? "flex-end" : "flex-start",
                wordBreak: "break-word",
            }}
        >
            <Typography variant="body2">{message.text}</Typography>
            <Typography variant="caption" color={message.sender === "Me" ? "#cceeff" : "text.secondary"} sx={{ display: "block", mt: 0.5 }}>
                {message.time}
            </Typography>
        </Box>
    );
};

export default MessageBubble;