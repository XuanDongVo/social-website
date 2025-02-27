import React from "react";
import { Box, InputBase, IconButton, Button } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ChatInput = ({ newMessage, setNewMessage, onSendMessage }) => {
    return (
        <Box sx={{ p: 2, backgroundColor: "#fff", borderTop: "1px solid #ddd", display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="primary" size="small">
                <InsertEmoticonIcon />
            </IconButton>
            <IconButton color="primary" size="small">
                <ImageIcon />
            </IconButton>
            <InputBase
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
                fullWidth
                sx={{ p: 1, border: "1px solid #ddd", borderRadius: 20, flexGrow: 1 }}
            />
            <IconButton color="primary" size="small">
                <FavoriteBorderIcon />
            </IconButton>
            <Button
                variant="contained"
                color="primary"
                onClick={onSendMessage}
                disabled={!newMessage.trim()}
                sx={{ borderRadius: 20, minWidth: 40, padding: "6px 12px" }}
            >
                <SendIcon />
            </Button>
        </Box>
    );
};

export default ChatInput;