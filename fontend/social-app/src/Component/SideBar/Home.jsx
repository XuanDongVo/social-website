import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, tooltipClasses } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

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

const Home = () => {

    return (
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem disablePadding>
                <ListItemButton>
                    <CustomTooltip title="Home" placement="bottom-end">
                        <ListItemIcon style={{ minWidth: '40px' }}><HomeIcon /></ListItemIcon>
                    </CustomTooltip>
                    <ListItemText primary="Home" />
                </ListItemButton>
            </ListItem>
        </Link>
    )
}

export default Home;