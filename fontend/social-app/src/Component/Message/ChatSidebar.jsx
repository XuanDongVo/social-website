import React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ChatSidebar = ({ chatList, selectedChat, onSelectChat }) => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 300,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: 300,
                    boxSizing: "border-box",
                    borderRight: "1px solid #ddd",
                    backgroundColor: "#fafafa",
                },
            }}
        >
            <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: "grey.500" }} />,
                    }}
                    sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 8 }}
                />
            </Box>
            <List>
                {chatList.map((chat) => (
                    <ListItem
                        button
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        selected={selectedChat?.id === chat.id}
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
                ))}
            </List>
        </Drawer>
    );
};

export default ChatSidebar;