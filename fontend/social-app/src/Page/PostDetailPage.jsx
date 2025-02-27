import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Box,
    Typography,
    IconButton,
    CardActions,
    TextField,
    CircularProgress,
    CardContent,
    Dialog,
    DialogContent,
    Container,
} from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CommentIcon from "@mui/icons-material/MapsUgcOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Comment from "../Component/Comment/Comment";
import Caption from "../Component/Comment/Caption";
import EmojiPicker from 'emoji-picker-react';
import SwiperImage from "../Component/SwiperImage/SwiperImage";
import { isFollowing, followUser } from "../Api/Follow/Follow";
import ButtonSavedPost from "../Component/Button/ButtonSavedPost";
import ButtonLike from "../Component/Button/ButtonLike";
import AvatarUser from "../Component/Avatar/AvatarUser";
import { useParams, Link } from "react-router-dom";
import { getPostById } from "../Api/Post/Post";
import UserPostGallery from "../Component/UserPostGallery/UserPostGallery";

const PostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [comment, setComment] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [countLikes, setCountLikes] = useState(0);
    const [showLikeDialog, setShowLikeDialog] = useState(false);

    // Fetch bài viết khi postId thay đổi
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await getPostById(postId);
                setPost(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    // Kiểm tra trạng thái theo dõi và cập nhật countLikes khi post thay đổi
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

        if (post) {
            setCountLikes(post.countLikes || 0); // Đồng bộ countLikes với post
            checkFollowing(); // Gọi kiểm tra follow khi có post
        }
    }, [post]);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleEmojiClick = (emojiObject) => {
        setComment((prev) => prev + emojiObject.emoji);
    };

    const handleUpdateLikes = (newLikedState) => {
        setCountLikes((prev) => (newLikedState ? prev + 1 : prev - 1));
    };

    const handleFollow = async () => {
        setIsUpdating(true);
        try {
            const response = await followUser(post.user.id);
            setIsFollowingUser(response.data);
        } catch (error) {
            console.error("Lỗi khi follow:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleDeletePost = async () => {
        // Thêm logic xóa bài viết nếu cần (ví dụ: gọi API)
        // await deletePost(postId);
        setOpenConfirmDialog(false);
    };

    const isAuth = true;

    // Hiển thị loading khi dữ liệu đang được tải
    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: "flex", gap: 1, p: 3 }}>
                <Box sx={{
                    flex: "2",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    // maxHeight: "50vh",
                }}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "66.6%",

                    }}>
                        <SwiperImage images={post?.images || []} />
                    </Box>
                </Box>

                <Box sx={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "33.3%", // Sửa lỗi cú pháp "33,3%"
                    border: "1px solid #dee2e6"
                }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AvatarUser
                                profilePicURL={post?.user?.profilePicURL}
                                hasStory={true}
                                seenStory={true}
                                size={32}
                            />
                            <Typography fontWeight="bold">
                                {post?.user?.firstName} {post?.user?.lastName}
                            </Typography>
                        </Box>
                        {isAuth ? (
                            <IconButton onClick={handleOpenConfirmDialog}>
                                <DeleteIcon fontSize="small" sx={{ color: "gray" }} />
                            </IconButton>
                        ) : (
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
                    <Divider sx={{ my: 0.5, borderBottomWidth: 3 }} />

                    <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
                        {post?.caption && <Caption post={post} />}
                        {post?.comments?.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                    </Box>

                    <Divider sx={{ my: 0.5, borderBottomWidth: 3 }} />

                    <CardActions disableSpacing sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
                        <Box display="flex" gap={1}>
                            <ButtonLike post={post} onLikeChange={handleUpdateLikes} />
                            <IconButton sx={{ padding: 0 }}>
                                <CommentIcon />
                            </IconButton>
                        </Box>
                        <ButtonSavedPost post={post} />
                    </CardActions>

                    <CardContent sx={{ padding: 1, display: "flex", flexDirection: "column" }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            onClick={() => setShowLikeDialog(true)}
                            sx={{ cursor: "pointer" }}
                        >
                            {countLikes} likes
                        </Typography>
                        {post?.countComments > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                View all {post.countComments} comments
                            </Typography>
                        )}
                    </CardContent>

                    <Divider sx={{ my: 0.5, borderBottomWidth: 3 }} />

                    <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
                        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            <SentimentSatisfiedAltIcon color={showEmojiPicker ? "primary" : "default"} />
                        </IconButton>
                        {showEmojiPicker && (
                            <Box sx={{
                                position: "absolute",
                                bottom: "100%",
                                left: 0,
                                zIndex: 2035,
                                background: "white",
                                borderRadius: "8px",
                                boxShadow: 3,
                            }}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </Box>
                        )}
                        <TextField
                            fullWidth
                            placeholder="Add a comment..."
                            variant="standard"
                            size="small"
                            multiline
                            minRows={1}
                            maxRows={3}
                            sx={{ mt: 1, flex: 1 }}
                            onChange={handleCommentChange}
                            value={comment}
                        />
                        <Button
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: comment ? "#1877F2" : "#ECF3FF",
                                cursor: "pointer",
                                "&:hover": { backgroundColor: "white" },
                            }}
                        >
                            Post
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 2, borderBottomWidth: 2, borderColor: "black" }} />

            <Box sx={{ display: "flex", p: 2, flexDirection: "column", gap: 0.5, p: 0 }}>
                <Typography variant="body2" sx={{ px: 3, mb: 1, color: "rgb(115, 115, 115)" }}>
                    More posts from  {" "}
                    <Link to={`/profile/${post.user.id}`} style={{ color: "black", textDecoration: "none" }}>
                        {post?.user?.firstName} {post?.user?.lastName}
                    </Link>
                </Typography>
                <UserPostGallery userId={post?.user?.id} postId={postId} />
            </Box>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                sx={{ "& .MuiDialog-paper": { borderRadius: 3, padding: 2, width: 400 } }}
            >
                <DialogContent>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Xác nhận xóa bài viết
                        </Typography>
                        <Typography color="text.secondary">
                            Bạn có chắc chắn muốn xóa bài viết này không?
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button
                            onClick={handleCloseConfirmDialog}
                            variant="outlined"
                            sx={{ flex: 1, mr: 1, borderRadius: 2 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDeletePost}
                            variant="contained"
                            color="error"
                            sx={{ flex: 1, ml: 1, borderRadius: 2 }}
                        >
                            Xóa
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default PostDetailPage;