import React, { useState, useEffect, useContext } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, tooltipClasses, Drawer, Box, Typography, Divider, Badge } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../Contexts/AuthContext";
import NotificationItem from "../NotificationItem/NotifcationItem";
import { getNotificationOfUser, markAsRead } from "../../Api/Notification/Notification";

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
const Notifications = ({ toggleSidebar, sidebarWidth }) => {
    const { notifications, setNotifications } = useContext(AuthContext);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [enableTransition, setEnableTransition] = useState(false);



    // Lấy danh sách thông báo khi component được render
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getNotificationOfUser();
                setNotifications(prevNotifications => [...prevNotifications, ...response.data]);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, []);

    // Đánh dấu tất cả thông báo là đã đọc
    useEffect(() => {
        const markAllAsRead = async () => {
            try {
                await markAsRead();
            } catch (error) {
                console.error("Error marking notifications as read:", error);
            }
        };
        markAllAsRead();
    }, []);




    useEffect(() => {
        if (sidebarWidth > 55) {
            setEnableTransition(true);
        } else {
            setEnableTransition(false);
        }
    }, [sidebarWidth]);

    const handleClick = () => {
        setOpenDrawer(!openDrawer);
        toggleSidebar(!openDrawer);
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={handleClick}>
                    <CustomTooltip title="Notification" placement="bottom-end">
                        <ListItemIcon style={{ minWidth: '40px' }}>
                            <Badge
                                badgeContent={notifications.filter(noti => noti.status === 'UNREAD').length}
                                color="error"
                                invisible={notifications.filter(noti => noti.status === 'UNREAD').length === 0}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <FavoriteBorderIcon />
                            </Badge>
                        </ListItemIcon>
                    </CustomTooltip>
                    <ListItemText primary="Notifications" />
                </ListItemButton>
            </ListItem>

            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                variant="persistent"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 350,
                        ml: `${sidebarWidth}px`,
                        transition: enableTransition ? "margin-left 0.3s ease" : "none",
                        padding: "20px",
                    },
                }}
            >
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Notifications
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                            <NotificationItem key={index} notification={notif} />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Không có thông báo nào
                        </Typography>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default Notifications;