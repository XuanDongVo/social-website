import { Avatar, Stack, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import AvatarUser from "../Avatar/AvatarUser";

const Caption = ({ post }) => {
    return (
        <Stack direction="row" spacing={0.25} alignItems="center">
            <Link to={`/profile/${post?.user?.id}`}>
                <AvatarUser profilePicURL={post?.user?.profilePicture} hasStory={false} seenStory={false} size={36} />
            </Link>
            <Box sx={{ p: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Link to={`/profile/${post?.user?.id}`} style={{ textDecoration: "none", color: "black" }}>
                        <Typography fontWeight="bold" fontSize={14}>
                            {post?.user?.firstName} {post?.user?.lastName}
                        </Typography>
                    </Link>
                    <Typography fontSize={14}>{post.caption}</Typography>
                </Stack>
                <Typography fontSize={12} color="gray">
                    {(post.createdAt)}
                </Typography>
            </Box>
        </Stack>
    );
};

export default Caption;
