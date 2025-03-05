import React from "react";
import { Box, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const MessageBubble = ({ message, isLastMessageFromMe }) => {
    return (
        <Box
            sx={{
                width: "100%", // Sử dụng toàn bộ chiều rộng để căn chỉnh sát lề
                display: "flex",
                flexDirection: "column",
                alignItems: message.sender === "Me" ? "flex-end" : "flex-start",
                mb: 2, // Khoảng cách giữa các tin nhắn
            }}
        >
            {/* Bong bóng cho văn bản */}
            {message.text && (
                <Box
                    sx={{
                        maxWidth: "70%",
                        p: 1.5,
                        mb: 0.5,
                        backgroundColor: message.sender === "Me" ? "#0084ff" : "#e9ecef",
                        color: message.sender === "Me" ? "#fff" : "inherit",
                        borderRadius: 5,
                        alignSelf: message.sender === "Me" ? "flex-end" : "flex-start",
                        wordBreak: "break-word",
                    }}
                >
                    {/* Hiển thị nội dung văn bản */}
                    <Typography variant="body2">{message.text}</Typography>

                    {/* Hiển thị thời gian và trạng thái đọc */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            fontSize: "0.7rem",
                        }}
                    >
                        <Typography
                            variant="caption"
                            color={message.sender === "Me" ? "#cceeff" : "text.secondary"}
                            sx={{ mr: 0.5 }}
                        >
                            {message.time || ""}
                        </Typography>

                        {message.sender === "Me" && isLastMessageFromMe && (
                            message.seen ? (
                                <DoneAllIcon
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: "#cceeff",
                                    }}
                                />
                            ) : (
                                <DoneIcon
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: "#cceeff",
                                    }}
                                />
                            )
                        )}
                    </Box>
                </Box>
            )}

            {/* Bong bóng cho ảnh */}
            {message.urlImage && (
                <Box
                    sx={{
                        maxWidth: "20%",
                        alignSelf: message.sender === "Me" ? "flex-end" : "flex-start",
                        borderRadius: 5,
                    }}
                >
                    <Box
                        component="img"
                        src={message.urlImage}
                        alt="Message Image"
                        sx={{
                            maxWidth: "100%", // Đảm bảo ảnh không vượt quá bong bóng
                            height: "auto", // Giữ tỷ lệ ảnh
                            display: "block", // Đảm bảo ảnh hiển thị đúng
                        }}
                    />

                </Box>
            )}
        </Box>
    );
};

export default MessageBubble;