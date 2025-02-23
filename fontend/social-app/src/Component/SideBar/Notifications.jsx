import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, tooltipClasses } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";

// Custom Tooltip
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#fff", // Nền trắng
        color: "#000", // Chữ đen
        border: "1px solid #dbdbdb", // Viền xám nhẹ
        fontSize: "14px",
        boxShadow: theme.shadows[1],
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#fff", // Đổi màu của mũi tên
    },
}));

const Notifications = () => {

    return (
        <ListItem disablePadding>
            <ListItemButton>
                <CustomTooltip title="Notification" placement="bottom-end">
                    <ListItemIcon style={{ minWidth: '40px' }}><FavoriteBorderIcon /></ListItemIcon>
                </CustomTooltip>
                <ListItemText primary="Notifcations" />
            </ListItemButton>
        </ListItem>
    )
}

export default Notifications;