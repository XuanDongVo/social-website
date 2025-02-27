import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box } from "@mui/material";

const ChatListItem = ({ chat, onSelect, selected }) => {
    return (
        <ListItem
            button
            onClick={onSelect}
            selected={selected}
            sx={{
                "&.Mui-selected": { backgroundColor: "#e9ecef" },
                "&:hover": { backgroundColor: "#f0f0f0" },
                padding: "8px 16px",
            }}
        >
            <ListItemAvatar>
                <Avatar alt={chat.name} src={chat.avatar} sx={{ width: 40, height: 40 }} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle1" fontWeight="500">
                        {chat.name}
                    </Typography>
                }
                secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {chat.lastMessage}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {chat.time}
                        </Typography>
                        {chat.active && (
                            <Typography variant="caption" color="green">
                                Active now
                            </Typography>
                        )}
                    </Box>
                }
            />
        </ListItem>
    );
};

export default ChatListItem;