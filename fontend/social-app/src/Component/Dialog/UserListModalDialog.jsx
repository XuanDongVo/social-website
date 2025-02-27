import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    TextField,
    List,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem"; // Component cho từng mục người dùng

const UserListModalDialog = ({ open, onClose, users, title, actionButtonText, onAction }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div />
                {title}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "grey.500",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search"
                        size="small"
                    // sx={{ mb: 2 }}
                    />
                </Box>
                <List sx={{ p: 0 }}>
                    {users.map((user) => (
                        <UserListItem
                            key={user.follow.id}
                            user={user}
                            actionButtonText={actionButtonText}
                            onAction={() => onAction(user.follow.id)}
                        />
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default UserListModalDialog;