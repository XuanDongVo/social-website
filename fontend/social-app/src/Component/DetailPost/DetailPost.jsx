import {
    Button,
    Divider,
    Box,
    Dialog,
    DialogContent,
    Typography,
    IconButton,
    CardActions,
    TextField,
    CircularProgress,
    CardContent
} from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CommentIcon from "@mui/icons-material/MapsUgcOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useContext } from "react";
import Comment from "../Comment/Comment";
import Caption from "../Comment/Caption";
import EmojiPicker from 'emoji-picker-react';
import SwiperImage from "../SwiperImage/SwiperImage";
import { isFollowing, followUser } from "../../Api/Follow/Follow";
import ButtonSavedPost from "../Button/ButtonSavedPost";
import ButtonLike from "../Button/ButtonLike";
import AvatarUser from "../Avatar/AvatarUser";
import { addComment, getComments } from "../../Api/Comment/Comment";
import { AuthContext } from "../../Contexts/AuthContext";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const DetailPost = ({ post, isOpen, onClose, isAuth, onDeleted }) => {
    const { user } = useContext(AuthContext);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [comment, setComment] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [countLikes, setCountLikes] = useState(post?.countLikes || 0);
    const [showLikeDialog, setShowLikeDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comments, setComments] = useState(post?.comments || []);
    const [replyingTo, setReplyingTo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageComment, setPageComment] = useState(0);
    const [showMoreComments, setShowMoreComments] = useState(true);

    const handleCommentChange = (event) => {
        // Chỉ lấy phần nội dung sau "@username " nếu đang reply
        const value = event.target.value;
        const usernamePrefix = replyingTo ? `@${replyingTo.sender.firstName}${replyingTo.sender.lastName} ` : "";
        const content = value.startsWith(usernamePrefix) ? value.slice(usernamePrefix.length) : value;
        setComment(content);
    };

    const handleEmojiClick = (emojiObject) => {
        setComment((prev) => {
            const newComment = prev + emojiObject.emoji;
            console.log("Emoji added:", newComment);
            return newComment;
        });
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
    }, [post?.user?.id]);

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

    const handleReply = (comment) => {
        setReplyingTo(comment);
        setShowEmojiPicker(false);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setComment(""); // Xóa nội dung khi hủy reply
    };

    const handleSubmitComment = async () => {
        if (!comment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const commentRequest = {
                postId: post.postId,
                senderId: user.id,
                content: comment,
                parentCommentId: replyingTo?.id || null
            };

            const newComment = await addComment(commentRequest);

            if (replyingTo) {
                setComments(prevComments => prevComments.map(c =>
                    c.id === replyingTo.id
                        ? { ...c, replies: [...(c.replies || []), commentRequest] }
                        : c
                ));
            } else {
                setComments(prev => [...prev, commentRequest]);
            }

            setComment("");
            setReplyingTo(null);
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey && !isSubmitting) {
            event.preventDefault();
            handleSubmitComment();
        }
    };

    const fetchComments = async () => {
        try {
            const response = await getComments(post.postId, pageComment);
            if (response.data.length === 0 || response.data.length < 20) {
                console.log("Hết comment để lấy");
                setShowMoreComments(false);
            }
            const updatedComments = response.data.map(comment => ({
                ...comment,
                replies: flattenReplies([comment])
            }));
            setComments(prevComments => [...prevComments, ...updatedComments]); // Gộp comment mới vào danh sách cũ
        } catch (error) {
            console.error("Lỗi khi lấy comment:", error);
        }
        finally {
            setLoading(false);
        }
    };

    // Lấy danh sách comment khi postId hoặc pageComment thay đổi
    useEffect(() => {
        fetchComments();
    }, [post.postId, pageComment]);



    // Hàm flatten chỉ các replies của comment gốc
    const flattenReplies = (comments) => {
        let flatReplies = [];
        comments.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
                flatReplies = flatReplies.concat(comment.replies);
                // Duyệt qua các reply để flatten thêm nếu có nested replies
                const nestedReplies = comment.replies.reduce((acc, reply) => {
                    if (reply.replies && reply.replies.length > 0) {
                        return acc.concat(flattenReplies([reply]));
                    }
                    return acc;
                }, []);
                flatReplies = flatReplies.concat(nestedReplies);
            }
        });
        return flatReplies;
    };

    const handleGetMoreComments = async () => {
        setLoading(true);
        setPageComment(prev => prev + 1);
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
                                <AvatarUser profilePicURL={post?.user?.profilePicture} hasStory={false} seenStory={false} size={36} />
                                <Typography fontWeight="bold">{post?.user.firstName} {post?.user.lastName}</Typography>
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

                        {/* Danh sách bình luận */}
                        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
                            {post.caption && <Caption post={post} />}
                            {comments.map((comment) => (
                                <div key={comment.id}>
                                    <Comment comment={comment} onReply={handleReply} />
                                    {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                                        <Box sx={{ ml: 5, mt: 1 }}>
                                            <Comment key={reply.id} comment={reply} onReply={handleReply} />
                                        </Box>
                                    ))}
                                </div>
                            ))}
                            {showMoreComments && (
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 1 }}>
                                    <IconButton variant="black" onClick={handleGetMoreComments}>
                                        {loading ? <CircularProgress size={20} /> : <ControlPointIcon />}
                                    </IconButton>
                                </Box>
                            )}
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
                                disabled={isSubmitting}
                                value={comment}
                                onKeyPress={handleKeyPress}
                                InputProps={{
                                    startAdornment: replyingTo ? (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography
                                                component="span"
                                                sx={{ color: "#0095f6", mr: 0.5 }} // Màu xanh giống Instagram
                                            >
                                                @{replyingTo.sender.firstName}{replyingTo.sender.lastName}{" "}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={handleCancelReply}
                                                sx={{ p: 0 }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ) : null,
                                }}
                            />
                            <Button
                                onClick={handleSubmitComment}
                                disabled={!comment.trim() || isSubmitting}
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: comment.trim() && !isSubmitting ? "#1877F2" : "#ECF3FF",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "white" },
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={20} /> : "Post"}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

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
        </>
    );
};

export default DetailPost;