import { Avatar, AvatarGroup, Button, Box, Typography, Stack, CircularProgress, Dialog, Container } from "@mui/material";
import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { isFollowing, followUser, getFollowing, getFollowers, deleteFollower } from "../../Api/Follow/Follow";
import UserListModalDialog from "../Dialog/UserListModalDialog";



const ProfileHeader = ({ userProfile }) => {
    const { user } = useContext(AuthContext);
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [openFollowers, setOpenFollowers] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);
    const [followers, setFollowers] = useState([]); // State lưu danh sách Followers
    const [following, setFollowing] = useState([]); // State lưu danh sách Following
    const [loadingFollowers, setLoadingFollowers] = useState(false); // State loading cho Followers
    const [loadingFollowing, setLoadingFollowing] = useState(false); // State loading cho Following


    const fetchFollowers = useCallback(async () => {
        setLoadingFollowers(true);
        try {
            if (userProfile?.user?.id) {
                const response = await getFollowers();
                setFollowers(response.data || []);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Followers:", error);
        } finally {
            setLoadingFollowers(false);
        }
    }, [userProfile?.user?.id]);

    const fetchFollowing = useCallback(async () => {
        setLoadingFollowing(true);
        try {
            if (userProfile?.user?.id) {
                const response = await getFollowing();
                setFollowing(response.data || []);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Following:", error);
        } finally {
            setLoadingFollowing(false);
        }
    }, [userProfile?.user?.id]);

    const checkFollowingStatus = useCallback(async () => {
        if (userProfile?.user?.id) {
            try {
                const response = await isFollowing(userProfile.user.id);
                setIsFollowingUser(response.data);
            } catch (error) {
                console.error("Lỗi khi kiểm tra follow:", error);
            }
        }
    }, [userProfile?.user?.id]);

    const handleFollow = useCallback(async () => {
        setIsUpdating(true);
        try {
            if (userProfile?.user?.id) {
                const response = await followUser(userProfile.user.id);
                setIsFollowingUser(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi follow:", error);
        } finally {
            setIsUpdating(false);
        }
    }, [userProfile?.user?.id]);


    useEffect(() => {
        checkFollowingStatus();
    }, [checkFollowingStatus]);

    const handleOpenFollowers = () => {
        setOpenFollowers(true);
        fetchFollowers();
    };

    const handleOpenFollowing = () => {
        setOpenFollowing(true);
        fetchFollowing();
    };

    const handleRemoveFollower = async (userId) => {
        await deleteFollower(userId);
        await fetchFollowers();

    };

    const handleUnfollow = async (userId) => {
        await followUser(userId);
        await fetchFollowing();
    };

    if (!userProfile) {
        return <CircularProgress />;
    }

    const visitingOwnProfileAndAuth = userProfile.user.id === user.id;
    const visitingAnotherProfileAndAuth = userProfile.user.id !== user.id;

    return (
        <Box sx={{ py: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", width: "100%" }}>
            <Container
                maxWidth="md"
                disableGutters
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0 10rem" }}
            >
                <AvatarGroup>
                    <Avatar
                        src={userProfile?.profilePicURL || "https://fakeimg.pl/440x320/?text=Image1"}
                        alt="User Profile"
                        sx={{ width: 150, height: 150 }}
                    />
                </AvatarGroup>
                <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6">{userProfile?.firstName} {userProfile?.lastName}</Typography>
                        {visitingOwnProfileAndAuth && (
                            <Button variant="outlined" size="small" onClick={() => setIsOpen(true)}>
                                Edit Profile
                            </Button>
                        )}
                        {visitingAnotherProfileAndAuth && (
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
                    <Box display="flex" gap={2}>
                        <Button sx={{ color: 'black' }}><Typography variant="body2"><strong>{userProfile?.postCount || 0}</strong> Posts</Typography></Button>
                        <Button
                            sx={{ color: 'black' }}
                            onClick={handleOpenFollowers} // Mở modal trước, sau đó fetch
                            disabled={loadingFollowers}
                        >
                            {loadingFollowers ? <CircularProgress size={20} /> : <Typography variant="body2"><strong>{userProfile?.followerCount || 0}</strong> Followers</Typography>}
                        </Button>
                        <Button
                            sx={{ color: 'black' }}
                            onClick={handleOpenFollowing} // Mở modal trước, sau đó fetch
                            disabled={loadingFollowing}
                        >
                            {loadingFollowing ? <CircularProgress size={20} /> : <Typography variant="body2"><strong>{userProfile?.followingCount || 0}</strong> Following</Typography>}
                        </Button>
                    </Box>
                    <Typography variant="body1" fontWeight="bold" padding="0px 8px" margin="0">
                        {userProfile?.user?.firstName} {userProfile?.user?.lastName}
                    </Typography>
                </Stack>
                <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                    <Box p={3}>Edit Profile Placeholder</Box>
                </Dialog>
            </Container>

            <UserListModalDialog
                open={openFollowers}
                onClose={() => {
                    setOpenFollowers(false);
                    setFollowers([]);
                }}
                users={followers}
                title="Followers"
                actionButtonText="Remove"
                onAction={handleRemoveFollower}
                loading={loadingFollowers}
            />

            <UserListModalDialog
                open={openFollowing}
                onClose={() => {
                    setOpenFollowing(false);
                    setFollowing([]);
                }}
                users={following}
                title="Following"
                actionButtonText="Following"
                onAction={handleUnfollow}
                loading={loadingFollowing}
            />
        </Box>
    );
};

export default ProfileHeader;