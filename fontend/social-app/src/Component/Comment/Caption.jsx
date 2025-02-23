import { Avatar, Stack, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import AvatarUser from "../Avatar/AvatarUser";

const Caption = ({ post }) => {
    const [authUser] = useState({ id: 999, username: "my_profile", profilePicURL: "https://i.pravatar.cc/48" });

    return (
        <Stack direction="row" spacing={0.25} alignItems="center">
            <Link to={`/${authUser.username}`}>
                <AvatarUser profilePicURL={post?.user?.profilePicURL} hasStory={true} seenStory={true} size={32} />
            </Link>
            <Box sx={{ p: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Link to={`/${authUser.username}`} style={{ textDecoration: "none", color: "black" }}>
                        <Typography fontWeight="bold" fontSize={12}>
                            {authUser.username}
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
