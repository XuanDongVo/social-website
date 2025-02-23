import React, { useContext } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, tooltipClasses } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../Contexts/AuthContext";

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

const ProfileLink = () => {
    const { user } = useContext(AuthContext);

    return (
        <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem disablePadding>
                <ListItemButton>
                    <CustomTooltip title="Profile" placement="bottom-end">
                        <ListItemIcon style={{ minWidth: '40px' }}><AccountCircleIcon /></ListItemIcon>
                    </CustomTooltip>
                    <ListItemText primary="Profile" />
                </ListItemButton>
            </ListItem>
        </Link>
    )
}

export default ProfileLink;