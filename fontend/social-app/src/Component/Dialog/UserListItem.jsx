import React from "react";
import { ListItem, ListItemAvatar, ListItemText, Button } from "@mui/material";
import AvatarUser from "../../Component/Avatar/AvatarUser";

const UserListItem = ({ user, actionButtonText, onAction, disableAction }) => {
    return (
        <ListItem
            secondaryAction={
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        const userId = user?.id || user?.follow?.id;
                        onAction(userId);
                    }}
                    disabled={disableAction}
                    sx={{
                        borderColor: "grey.300",
                        color: "grey.800",
                        "&:hover": {
                            borderColor: "grey.500",
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                    }}
                >
                    {actionButtonText}
                </Button>
            }
            sx={{ p: 1 }}
        >
            <ListItemAvatar>
                <AvatarUser profilePicURL={user?.follow?.profilePicURL} size={42} />
            </ListItemAvatar>
            <ListItemText
                primary={`${user?.follow?.firstName} ${user?.follow?.lastName}`}
                sx={{ ml: 1 }}
            />
        </ListItem>
    );
};

export default UserListItem;