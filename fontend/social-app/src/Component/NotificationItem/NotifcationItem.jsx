import React from "react";
import { Avatar, Box, Stack, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom"; // Import từ react-router-dom
import moment from "moment";
import AvatarUser from "../Avatar/AvatarUser"; // Giả sử component AvatarUser đã được định nghĩa

const notificationTemplates = {
    FOLLOW: { message: (actorName) => `${actorName} started following you.`, hasImage: false },
    LIKE: { message: (actorName) => `${actorName} liked your photo.`, hasImage: true, imageKey: "urlImage" },
    COMMENT: { message: (actorName) => `${actorName} commented on your post.`, hasImage: false },
    MENTION: { message: (actorName) => `${actorName} mentioned you in a post.`, hasImage: false },
    SHARE: { message: (actorName) => `${actorName} shared your post.`, hasImage: false },
};

const NotificationItem = ({ notification }) => {
    const actorName = `${notification.actor?.firstName || ''} ${notification.actor?.lastName || ''}`.trim() || "Unknown";
    const timeAgo = moment(notification.createdAt).fromNow();
    const template = notificationTemplates[notification?.actionType] || notificationTemplates["FOLLOW"];

    const actorProfilePath = `/profile/${notification.actor?.id}`; // Đường dẫn tới profile của actor
    const postPath = `/post/${notification.entityId}`; // Đường dẫn tới post (dựa vào entityId)

    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
                p: 1, // Tăng padding để đẹp hơn
                bgcolor: "#f5f5f5", // Nền xám nhạt
                borderRadius: 2, // Bo góc lớn hơn
                mb: 1, // Khoảng cách giữa các mục
                "&:hover": {
                    bgcolor: "#e0e0e0", // Hiệu ứng hover nhẹ
                    cursor: "pointer",
                },
            }}
        >
            {/* Avatar bọc trong link tới post */}
            <Link component={RouterLink} to={actorProfilePath} underline="none">
                <AvatarUser
                    profilePicURL={notification.actor?.profilePicURL}
                    hasStory={false}
                    seenStory={false}
                    size={42} // Tăng kích thước avatar
                    sx={{ border: "2px solid #dbdbdb" }} // Viền avatar giống hình
                />
            </Link>
            <Box flexGrow={1}>
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                    {/* Tên actor là link tới profile */}
                    <Link
                        component={RouterLink}
                        to={actorProfilePath}
                        underline="hover"
                        color="inherit"
                        sx={{ fontWeight: "bold" }}
                    >
                        {actorName}
                    </Link>{" "}
                    {template.message(actorName).replace(actorName, "")}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                    {timeAgo}
                </Typography>
            </Box>
            {template.hasImage && notification[template.imageKey] && (
                <Link component={RouterLink} to={postPath} underline="none">
                    <Box
                        component="img" // Sử dụng Box làm wrapper cho thẻ <img>
                        src={notification[template.imageKey]}
                        sx={{
                            width: 50,
                            height: 50,
                            border: "1px solid #dbdbdb",
                            objectFit: "cover",
                            marginLeft: "0"
                        }}
                    />
                </Link>
            )}
        </Stack>
    );
};

export default NotificationItem;