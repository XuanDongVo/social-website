import React, { useContext } from "react";
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
    Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import { AuthContext } from "../../Contexts/AuthContext";

const ChatSidebar = ({ chatList, selectedChat, onSelectChat }) => {

    const { user } = useContext(AuthContext);

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
                            <Badge
                                color="success"
                                variant="dot"
                                invisible={!chat.isRecipientOnline}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                sx={{ "& .MuiBadge-dot": { width: 10, height: 10 } }}
                            >
                                <Avatar
                                    alt={chat.name}
                                    src={`https://via.placeholder.com/40?text=${chat.name[0]}`}
                                    sx={{ width: 40, height: 40 }}
                                />
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="subtitle1" fontWeight="500">
                                        {chat.name}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {chat.lastMessageTime ? moment(chat.lastMessageTime).format("hh:mm ") : ""}
                                    </Typography>
                                </Box>
                            }
                            secondary={
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box
                                        sx={{
                                            maxWidth: "70%",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color={chat.unReadCount > 0 ? 'textPrimary' : 'textSecondary'}
                                            sx={{ fontWeight: chat.unReadCount > 0 ? 'bold' : 'normal' }}
                                        >
                                            {user?.id === chat?.senderId ? "You: " : ""} {chat?.lastMessage || "No messages yet"}
                                        </Typography>
                                    </Box>
                                    <Badge badgeContent={chat.unReadCount} color="error" sx={{ ml: 1 }}>
                                        <Typography variant="caption" color="text.secondary"></Typography>
                                    </Badge>
                                </Box>
                            }
                            secondaryTypographyProps={{ component: "div" }}
                        />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default ChatSidebar;