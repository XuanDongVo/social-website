import { Container, Box } from "@mui/material";
import FeedPosts from "../Component/FeedPosts/FeedPosts.jsx";
import SuggestedUsers from "../Component/SuggestedUsers/SuggestedUsers.jsx";
import Stories from "../Component/Story/Stories.jsx";
const HomePage = () => {
    return (
        <Container maxWidth="lg">
            <Box display="flex" >
                {/* Cột chứa bài post */}
                <Box flex={2} sx={{ py: 5 }}>
                    <Stories />
                    <FeedPosts />
                </Box>

                <Box
                    flex={1}
                    sx={{
                        display: { xs: "none", lg: "block" },
                        maxWidth: "300px",
                        mr: 3
                    }}
                >
                    <SuggestedUsers />
                </Box>
            </Box>
        </Container>
    );
};

export default HomePage;
