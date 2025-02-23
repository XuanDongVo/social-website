import { Box, Container, Typography, Stack, Button, Avatar } from "@mui/material";
import SuggestedUser from "./SuggestedUser";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";



// Fake API để lấy danh sách người dùng gợi ý
const fetchFakeUsers = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, username: "john_doe", fullName: "John Doe", profilePicURL: "https://i.pravatar.cc/48", followers: [] },
                { id: 2, username: "jane_smith", fullName: "Jane Smith", profilePicURL: "https://i.pravatar.cc/48?img=5", followers: [] },
                { id: 3, username: "mark_taylor", fullName: "Mark Taylor", profilePicURL: "https://i.pravatar.cc/48?img=3", followers: [] }
            ]);
        }, 1500);
    });
};

const SuggestedUsers = () => {
    const [authUser] = useState({ id: 999, username: "my_profile", profilePicURL: "https://i.pravatar.cc/48" });
    const [isLoading, setIsLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await fetchFakeUsers(); // Wait for the API response
            setSuggestedUsers(users); // Set the resolved array
            setIsLoading(false); // Set loading to false
        };

        fetchUsers();
    }, []);


    if (isLoading) return null;

    return (
        <Container sx={{ py: 4, px: 3 }}>

            {/* Header - Hiển thị avatar & username của user đang đăng nhập */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Link to={`/${authUser.username}`}>
                        <Avatar src={authUser.profilePicURL} sx={{ width: 48, height: 48 }} />
                    </Link>
                    <Link to={`/${authUser.username}`} style={{ textDecoration: "none" }}>
                        <Typography variant="body1" fontWeight="bold" color="text.primary">
                            {authUser.username}
                        </Typography>
                    </Link>
                </Stack>
                <Button size="small" sx={{ textTransform: "none", fontWeight: "medium", color: "blue" }}>
                    Log out
                </Button>
            </Stack>

            {suggestedUsers.length > 0 && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold" color="gray">
                        Suggested for you
                    </Typography>
                    <Button size="small" sx={{ textTransform: "none", fontWeight: "bold", color: "gray" }}>
                        See All
                    </Button>
                </Stack>
            )}

            <Stack spacing={2} sx={{ mt: 2 }}>
                {suggestedUsers.map((user) => (
                    <SuggestedUser key={user.id} user={user} />
                ))}
            </Stack>

            <Box sx={{ fontSize: 12, color: "gray", mt: 3 }}>
                © 2025 Built By Xuan Dong
            </Box>
        </Container>
    );
};

export default SuggestedUsers;
