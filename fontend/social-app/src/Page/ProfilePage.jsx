import { Container, Box, Stack, Skeleton } from "@mui/material";
import ProfileHeader from "../Component/Profile/ProfileHeader";
import ProfileTabs from "../Component/Profile/ProfileTabs";
import { useState, useEffect, useCallback } from "react";
import { useParams, Outlet } from "react-router-dom";
import { getProfileUser } from "../Api/User/User";

const ProfilePage = () => {
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = useCallback(async () => {
        console.log("userId", userId);
        try {
            const response = await getProfileUser(userId);
            setUserProfile(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return (
        <Container maxWidth="lg" sx={{ marginTop: 0.5 }}>
            <Box sx={{ py: 1, px: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {isLoading ? <ProfileHeaderSkeleton /> : <ProfileHeader userProfile={userProfile} />}
            </Box>
            <Box sx={{ px: { xs: 2, sm: 4 }, maxWidth: "100%", mx: "auto" }}>
                <ProfileTabs value={1} userId={userId} />
                <Outlet />
            </Box>
        </Container>
    );
};

export default ProfilePage;

// Skeleton cho profile header
const ProfileHeaderSkeleton = () => {
    return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ py: 5 }}>
            <Skeleton variant="circular" width={150} height={150} />
            <Stack spacing={1} sx={{ width: "100%", maxWidth: 200 }}>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
            </Stack>
        </Stack>
    );
};
