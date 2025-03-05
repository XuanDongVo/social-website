import React from "react";
import {

    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,

} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Custom Tooltip
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #dbdbdb",
        fontSize: "14px",
        boxShadow: theme.shadows[1],
    },
    [`& .MuiTooltip-arrow`]: {
        color: "#fff",
    },
}));

const Message = () => {


    return (
        <>
            <Link to={`/chat`} style={{ textDecoration: 'none', color: 'black' }}>
                <ListItem disablePadding>
                    <ListItemButton >
                        <CustomTooltip title="Messages" placement="bottom-end">
                            <ListItemIcon style={{ minWidth: "40px" }}>
                                <ChatIcon />
                            </ListItemIcon>
                        </CustomTooltip>
                        <ListItemText primary="Messages" />
                    </ListItemButton>
                </ListItem>
            </Link>

        </>
    );
};

export default Message;
