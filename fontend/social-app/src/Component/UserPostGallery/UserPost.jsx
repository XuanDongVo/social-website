import React from "react";
import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";

const UserPost = ({ post }) => {
    return (
        <Box
            sx={{
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                border: "none", // Loại bỏ border để hình ảnh liền kề
            }}
        >
            {/* Overlay khi hover */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FavoriteIcon fontSize="small" sx={{ color: "white" }} />
                    <Typography fontWeight="bold" color="white">{post?.countLikes || 0}</Typography>

                    <CommentIcon fontSize="small" sx={{ color: "white" }} />
                    <Typography fontWeight="bold" color="white">{post?.countComments || 0}</Typography>
                </Box>
            </Box>

            {/* Ảnh bài post */}
            <img
                src={post?.images && post.images.length > 0 ? post.images[0] : "https://via.placeholder.com/250"}
                alt="profile post"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block", // Loại bỏ khoảng trắng dư thừa dưới hình ảnh
                }}
            />
        </Box>
    );
};

export default UserPost;