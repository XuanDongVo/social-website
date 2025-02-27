import {
    Button,
    Divider,
    Box,
    Dialog,
    DialogContent,
    Typography,
    IconButton,
    CardActions,
    TextField, CircularProgress, CardContent
} from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CommentIcon from "@mui/icons-material/MapsUgcOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import Comment from "../Comment/Comment";
import Caption from "../Comment/Caption";
import EmojiPicker from 'emoji-picker-react';
import SwiperImage from "../SwiperImage/SwiperImage";
import { isFollowing, followUser } from "../../Api/Follow/Follow";
import ButtonSavedPost from "../Button/ButtonSavedPost";
import ButtonLike from "../Button/ButtonLike";
import AvatarUser from "../Avatar/AvatarUser";

const DetailPost = ({ post, isOpen, onClose, isAuth, onDeleted }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [comment, setComment] = useState(""); // State lưu nội dung comment
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [countLikes, setCountLikes] = useState(post?.countLikes || 0);
    const [showLikeDialog, setShowLikeDialog] = useState(false);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };
    const handleEmojiClick = (emojiObject) => {
        setComment((prev) => prev + emojiObject.emoji);
    };


    const handleUpdateLikes = (newLikedState) => {
        setCountLikes((prev) => newLikedState ? prev + 1 : prev - 1);
    };

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
        await onDeleted();
        setOpenConfirmDialog(false);
    };


    return (
        <>

            {/* Dialog hiển thị chi tiết bài post */}
            <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xl" sx={{
                padding: 0,
                "& .MuiDialog-paper": {
                    height: "90vh",
                    maxHeight: "90vh",

                },
            }}>
                <DialogContent sx={{ height: "100%", display: "flex", padding: 0 }}>
                    {/* Ảnh Post - Chiếm 2/3 */}
                    <Box sx={{
                        flex: "2",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "black",
                        maxHeight: "90vh",
                    }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "66,6%",
                        }}>
                            <SwiperImage images={post.images} />

                        </Box>
                    </Box>

                    {/* Phần nội dung bên phải - Chiếm 1/3 */}
                    <Box sx={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        width: "33,3%",
                    }}>
                        {/* Header */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                <AvatarUser profilePicURL={post?.user?.profilePicURL} hasStory={true} seenStory={true} size={32} />

                                <Typography fontWeight="bold">{post?.user.firstName} {post?.user.lastName}</Typography>
                            </Box>
                            {isAuth ? (
                                <IconButton onClick={handleOpenConfirmDialog} >
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

                        {/* Danh sách bình luận */}
                        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
                            {post.caption && <Caption post={post} />}
                            {post?.comments?.map((comment) => (
                                <Comment key={comment.id} comment={comment} />
                            ))}
                        </Box>

                        <Divider sx={{ my: 0.5, borderBottomWidth: 3 }} />

                        {/* Khu vực tương tác */}
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

                        <Divider sx={{ my: 0.5, borderBottomWidth: 3 }} />

                        {/* Input nhập bình luận */}
                        <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
                            {/* Emoji Picker */}
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

                            {/* TextField nhập comment */}
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

                            {/* Button Post */}
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
                </DialogContent >

            </Dialog >

            {/* Dialog xác nhận xóa bài viết */}
            < Dialog
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
            </Dialog >




        </>
    );
};

export default DetailPost;
