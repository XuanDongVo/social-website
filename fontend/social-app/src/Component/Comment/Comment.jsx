import { Skeleton, Typography, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import AvatarUser from "../Avatar/AvatarUser";

const Comment = ({ comment }) => {
    const isLoading = false;
    const [user] = useState({ id: 999, username: "my_profile", profilePicURL: "https://i.pravatar.cc/48" });

    if (isLoading) return <CommentSkeleton />;

    return (
        <Stack direction="row" spacing={2} alignItems="center" >
            <Link to={`/${user.username}`}>
                <AvatarUser profilePicURL={user?.profilePicURL} hasStory={true} seenStory={true} size={32} />
            </Link>
            <Box sx={{ p: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Link to={`/${user.username}`} style={{ textDecoration: "none", color: "black" }}>
                        <Typography fontWeight="bold" fontSize={12}>
                            {user.username}
                        </Typography>
                    </Link>
                    <Typography fontSize={14}>{comment.comment}</Typography>
                </Stack>
                <Typography fontSize={12} color="gray">
                    {(comment.createdAt)}
                </Typography>
            </Box>
        </Stack>
    );
};

export default Comment;

const CommentSkeleton = () => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton variant="text" width={50} height={14} />
            </Box>
        </Stack>
    );
};
