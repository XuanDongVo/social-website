import React, { useState, useRef, useEffect } from "react";
import { Box, InputBase, IconButton, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import EmojiPicker from "emoji-picker-react";
import CloseIcon from "@mui/icons-material/Close";

const ChatInput = ({ newMessage, setNewMessage, onSendMessage }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState([]);

    // Hàm mở dialog chọn file
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Hàm xử lý khi chọn file
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setSelectedFile([file]);
            console.log(file);
        }
    };

    // Hàm xóa ảnh preview
    const handleRemoveImage = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
            setSelectedFile([]);;
            fileInputRef.current.value = "";
        }
    };

    // Hàm xử lý khi chọn emoji
    const handleEmojiClick = (emojiObject) => {
        setNewMessage((prev) => prev + emojiObject.emoji);
    };

    // Dọn dẹp URL khi component unmount hoặc preview thay đổi
    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage);
        };
    }, [previewImage]);

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: "#fff",
                borderTop: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                gap: 1,
                position: "relative",
            }}
        >
            {/* Nút mở Emoji Picker */}
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <SentimentSatisfiedAltIcon color={showEmojiPicker ? "primary" : "default"} />
            </IconButton>

            {/* Input file ẩn */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Nút mở dialog chọn ảnh */}
            <IconButton color="primary" size="small" onClick={handleImageClick}>
                <ImageIcon />
            </IconButton>

            {/* Box chứa InputBase và preview ảnh */}
            <Box
                sx={{
                    flexGrow: 1,
                    position: "relative",
                    border: "1px solid #ddd",
                    borderRadius: previewImage ? 5 : 20,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    minHeight: "40px", // Đảm bảo chiều cao đủ để hiển thị preview
                    position: "relative",
                }}
            >
                {previewImage && (
                    <Box
                        sx={{
                            // position: "absolute",
                            top: 4,
                            left: 8,
                            display: "flex",
                            alignItems: "center",
                            zIndex: 1, // Đặt ảnh lên trên InputBase
                        }}
                    >
                        <div style={{ width: "20px" }}></div>
                        <img
                            src={previewImage}
                            alt="Preview"
                            style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "4px", marginTop: "10px" }}
                        />
                        <IconButton
                            size="small"
                            onClick={handleRemoveImage}
                            sx={{ ml: -1, padding: "2px", color: "black", backgroundColor: "#dbdbdb", position: "absolute", top: 2, left: 80, zIndex: 2 }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                <InputBase
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && onSendMessage(selectedFile)}
                    fullWidth
                    sx={{
                        p: "8px 8px 8px 20px", // Padding trái lớn hơn để tránh chồng lấp

                        "& .MuiInputBase-input": {
                            padding: "4px 0",
                            position: "relative",
                            zIndex: 0, // Đặt văn bản dưới ảnh
                        },
                    }}
                />
            </Box>

            {/* Nút gửi tin nhắn */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => onSendMessage(selectedFile)}
                disabled={!newMessage.trim() && !selectedFile}
                sx={{ borderRadius: 20, minWidth: 40, padding: "6px 12px" }}
            >
                <SendIcon />
            </Button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "100%",
                        left: 0,
                        zIndex: 2035,
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: 3,
                    }}
                >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Box>
            )}
        </Box>
    );
};

export default ChatInput;