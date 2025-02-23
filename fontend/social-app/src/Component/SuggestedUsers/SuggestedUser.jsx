import { useState } from "react";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AvatarUser from "../Avatar/AvatarUser";

const SuggestedUser = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowUser = () => {
        setIsFollowing((prev) => !prev);
    };

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Link to={`/${user.username}`}>
                    {/* <Avatar src={user.profilePicURL} /> */}
                    <AvatarUser profilePicURL={user.profilePicURL} size={46} />
                </Link>
                <Stack spacing={0.5}>
                    <Link to={`/${user.username}`} style={{ textDecoration: "none" }}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">
                            {user.fullName}
                        </Typography>
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                        {user.followers.length} followers
                    </Typography>
                </Stack>
            </Stack>
            <Button
                size="small"
                sx={{ textTransform: "none", fontWeight: "medium", color: "blue" }}
                onClick={handleFollowUser}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
        </Stack>
    );
};

export default SuggestedUser;
