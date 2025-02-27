import React, { useState, useRef, useContext, useEffect } from "react";
import {
    Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, TextField, Typography, CircularProgress
} from "@mui/material";

import CommentIcon from "@mui/icons-material/MapsUgcOutlined";

import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiPicker from 'emoji-picker-react';
import DetailPost from "../DetailPost/DetailPost";
import SwiperImage from "../SwiperImage/SwiperImage";
import { AuthContext } from "../../Contexts/AuthContext";
import ButtonSavedPost from "../Button/ButtonSavedPost";
import ButtonLike from "../Button/ButtonLike";
import AvatarUser from "../Avatar/AvatarUser";
import UserListLikePostModalDialog from "../Dialog/UserListLikePostModalDialog";

import { isFollowing, followUser } from "../../Api/Follow/Follow";

const FeedPost = ({ post }) => {
    const { user } = useContext(AuthContext);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(post.comments);
    const [isOpen, setOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const commentRef = useRef(null);
    const [countLikes, setCountLikes] = useState(post?.countLikes || 0);
    const [showLikeDialog, setShowLikeDialog] = useState(false);

    const [isVisitingOwnProfile, setIsVisitingOwnProfile] = useState(false);

    useEffect(() => {
        if (post?.user?.id) {
            setIsVisitingOwnProfile(post.user.id === user.id);
        }
    }, []);

    const handleUpdateLikes = (newLikedState) => {
        setCountLikes((prev) => newLikedState ? prev + 1 : prev - 1);
    };


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const checkFollowing = async () => {
            if (post?.user?.id) {
                try {
                    const response = await isFollowing(post.user.id);
                    setIsFollowingUser(response.data);
                } catch (error) {
                    console.error("Lỗi khi kiểm tra follow:", error);
                }
            }
        };

        checkFollowing();
    }, []);


    const handleSubmitComment = () => {
        if (comment.trim()) {
            setComments([...comments, { id: comments.length + 1, text: comment }]);
            setComment("");
        }
    };
    const handleEmojiClick = (emojiObject) => {
        setComment((prev) => prev + emojiObject.emoji);
    };
    const handleFollow = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsFollowingUser(!isFollowingUser);
            setIsUpdating(false);
        }, 1000);
    };

    const handleDelete = () => {
        setIsDeleting(true);
        setTimeout(() => {
            setIsDeleting(false);
            alert("Post deleted!");
        }, 1000);
    };


    return (
        <Card sx={{ maxWidth: 600, margin: "30px auto", position: "relative" }}>
            <CardHeader
                avatar={<AvatarUser profilePicURL={post?.user?.profilePicURL} hasStory={true} seenStory={true} size={36} />}
                title={<Typography variant="subtitle1" fontWeight="bold">{post.user.firstName} {post.user.lastName}</Typography>}
                subheader="2 hours ago"
                action={
                    <Box display="flex" alignItems="center" gap={1}>
                        {isVisitingOwnProfile ? (
                            <IconButton onClick={handleDelete} disabled={isDeleting}>
                                <DeleteIcon fontSize="small" sx={{ color: isDeleting ? "gray" : "red" }} />
                            </IconButton>
                        ) :
                            (
                                <Button
                                    variant="contained"
                                    color={isFollowingUser ? "secondary" : "primary"}
                                    size="small"
                                    disabled={isUpdating}
                                    onClick={handleFollow}
                                >
                                    {isUpdating ? <CircularProgress size={20} /> : isFollowingUser ? "Unfollow" : "Follow"}
                                </Button>
                            )}
                    </Box>
                }
            />

            <Box>
                <SwiperImage images={post.images} />
            </Box>

            <CardActions disableSpacing sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
                <Box display="flex" gap={1}>
                    <ButtonLike post={post} onLikeChange={handleUpdateLikes} />
                    <IconButton onClick={handleOpen} sx={{ padding: 0 }}>
                        <CommentIcon />
                    </IconButton>
                </Box>

                <ButtonSavedPost post={post} />
            </CardActions>

            <CardContent sx={{ padding: 0.5, display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">
                    <strong>{post.user.firstName} {post.user.lastName}</strong> {post.caption}
                </Typography>

                <Typography
                    variant="like"
                    color="text.secondary"
                    onClick={() => setShowLikeDialog(true)}
                    sx={{ cursor: "pointer" }}
                >
                    {countLikes} likes
                </Typography>

                {post?.countComments > 0 && (
                    <Typography variant="comment" color="text.secondary">
                        View all {post?.countComments} comments
                    </Typography>
                )}
            </CardContent>



            <Box p={2} sx={{ padding: 1 }}>
                {comments?.map((c) => (
                    <Typography key={c.id} variant="body2" sx={{ mb: 1 }}>
                        <strong>{post.user.firstName} {post.user.lastName}</strong>: {c.text}
                    </Typography>
                ))}
                <Box display="flex" alignItems="center" position="relative">
                    <TextField
                        variant="standard"
                        placeholder="Add a comment..."
                        fullWidth
                        size="small"
                        multiline
                        minRows={1}
                        maxRows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        inputRef={commentRef}
                    />
                    {comment && <Button onClick={handleSubmitComment} sx={{ ml: 1 }}>Post</Button>}
                    <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <SentimentSatisfiedAltIcon color={showEmojiPicker ? "primary" : "default"} />
                    </IconButton>

                    {showEmojiPicker && (
                        <Box sx={{
                            position: "absolute",
                            bottom: "100%",
                            right: 0,
                            zIndex: 10,
                            background: "white",
                            borderRadius: "8px",
                            boxShadow: 3,
                        }}>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </Box>
                    )}
                </Box>
            </Box>
            {isOpen && <DetailPost post={post} isOpen={isOpen} onClose={handleClose} isAuth={isVisitingOwnProfile} />}

            <UserListLikePostModalDialog
                open={showLikeDialog}
                onClose={() => {
                    setShowLikeDialog(false);
                }}
                postId={post.postId}
            />
        </Card>
    );
};

export default FeedPost;
