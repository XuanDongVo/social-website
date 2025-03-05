import { Skeleton, Typography, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import AvatarUser from "../Avatar/AvatarUser";
import moment from "moment";

const Comment = ({ comment, onReply }) => {
    // Kiểm tra nếu comment không tồn tại hoặc đang loading
    if (!comment) return <CommentSkeleton />;

    return (
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ width: "100%", mt: 1 }}>
            <Link to={`/profile/${comment?.sender?.id}`}>
                <AvatarUser
                    profilePicURL={comment?.sender?.profilePicture}
                    hasStory={false}
                    seenStory={false}
                    size={36}
                />
            </Link>
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Link
                        to={`/profile/${comment?.sender?.id}`}
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        <Typography
                            fontWeight="bold"
                            fontSize={14}
                            sx={{ display: "inline" }}
                        >
                            {comment?.sender?.firstName} {comment?.sender?.lastName}
                        </Typography>
                    </Link>
                    <Typography fontSize={14} sx={{ display: "inline" }}>
                        {comment.content}
                    </Typography>
                </Stack>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.5, color: "gray" }}
                >
                    <Typography fontSize={12}>
                        {moment(comment.createAt).utcOffset(7).format("hh:mm A")}
                    </Typography>
                    <Typography
                        fontSize={12}
                        sx={{ cursor: "pointer" }}
                        onClick={() => onReply(comment)}
                    >
                        Reply
                    </Typography>
                </Stack>
            </Box>
        </Stack>
    );
};

const CommentSkeleton = () => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" width="100%">
            <Skeleton variant="circular" width={36} height={36} />
            <Box>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={80} height={16} />
            </Box>
        </Stack>
    );
};

export default Comment;