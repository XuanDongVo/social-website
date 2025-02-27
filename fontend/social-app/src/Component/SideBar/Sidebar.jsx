import { useState } from "react";
import { Drawer, Box, List } from "@mui/material";
import Home from "./Home";
import Search from "./Search";
import Notifications from "./Notifications";
import CreatePost from "./CreatePost";
import ProfileLink from "./ProfileLink";
import Message from "./Message";
import InstagramIcon from "@mui/icons-material/Instagram";
import Explore from "./Explore";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const sidebarWidth = open ? 300 : 55; // Định nghĩa chiều rộng sidebar

    const toggleSidebar = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: "flex", position: "relative" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: 300,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: 300,
                        transition: "width 0.3s",
                        overflowX: "hidden",
                        borderRight: "1px solid #dbdbdb",
                    },
                }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: "20px",
                        fontWeight: "bold",
                        display: "flex",
                        width: "100%",
                        padding: "8px 16px",
                        margin: "10px 0",
                        cursor: "pointer",
                        transition: "opacity 0.3s",
                        alignItems: "center",
                    }}
                >
                    {open ? "Instagram" : <InstagramIcon style={{ color: "black" }} fontSize="medium" />}
                </Link>

                <List>
                    <Home />
                    <Search toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
                    <Explore />
                    <Message />
                    <Notifications toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
                    <CreatePost />
                    <ProfileLink />
                </List>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
