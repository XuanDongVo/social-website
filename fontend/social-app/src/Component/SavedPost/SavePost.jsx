import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from "@mui/icons-material/Comment";
import DetailPost from '../DetailPost/DetailPost'
import { AuthContext } from "../../Contexts/AuthContext";


const ProfilePost = ({ post, onDelete }) => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const [isVisitingOwnProfile, setIsVisitingOwnProfile] = useState(false);
    useEffect(() => {
        if (post?.user?.id) {
            setIsVisitingOwnProfile(post.user.id === user.id);
        }
    }, [post, user]);

    const handleDelete = async () => {
        await onDelete(post.postId);
        setIsOpen(false);
    };


    return (
        <>
            <Box
                sx={{
                    cursor: "pointer",
                    position: "relative",
                    border: "1px solid #ddd",
                    overflow: "hidden",
                    height: '100%'
                }}
                onClick={handleOpen}
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
                        <Typography fontWeight="bold" color="white">{post?.countComments?.length || 0}</Typography>
                    </Box>
                </Box>

                {/* Ảnh bài post */}
                <img
                    src={post?.images[0]}
                    alt="profile post"
                    style={{ width: "100%", objectFit: "cover" }}
                />
            </Box>

            {/* Chi tiết bài post */}
            {isOpen && <DetailPost post={post} isOpen={isOpen} onClose={handleClose} isAuth={isVisitingOwnProfile} onDeleted={handleDelete} />}

            {/* Button Close Dialog */}
            {isOpen && <IconButton fontSize="large  "
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 8,
                    cursor: "pointer",
                    zIndex: 1301,
                    color: "white",
                    "&:hover": { backgroundColor: "none" },
                }}
            >
                <CloseIcon />
            </IconButton>}
        </>
    );
};

export default ProfilePost;
