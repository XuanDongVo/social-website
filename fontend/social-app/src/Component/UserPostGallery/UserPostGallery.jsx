import { Skeleton, Typography, Stack, Grid2 } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getSelfPosts } from "../../Api/Post/Post";
import { Link as RouterLink } from "react-router-dom"; // Sử dụng RouterLink để tránh xung đột
import UserPost from "./UserPost";

const UserPostGallery = ({ userId, postId }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getSelfPosts({ userId, page: 1 });
            console.log("Bài viết:", response.data.content);
            setPosts(response.data.content);
            const filteredPosts = response.data.content.filter((post) => post.postId !== postId);
            setPosts(filteredPosts);
            console.log("Bài viết sau khi lọc:", posts);

        } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, userId]);

    if (!posts || posts.length === 0) {
        return <NoPostsFound />;
    }

    return (
        <Grid2 spacing={0} sx={{ width: "100%", margin: "0 auto", display: "flex", gap: 0.25 }}>
            {isLoading &&
                [0, 1, 2].map((_, idx) => (
                    <Grid2 size={{ xs: 2, sm: 4, md: 4 }} key={idx}>
                        <Skeleton variant="rectangular" width="100%" height={300} />
                    </Grid2>
                ))}

            {!isLoading && (
                <>
                    {posts?.map((post) => (
                        <RouterLink
                            to={`/post/${post.postId}`}
                            key={post.postId}
                            sx={{
                                textDecoration: "none",
                                "&:hover": {
                                    opacity: 0.8,
                                },
                            }}
                        >
                            <Grid2
                                key={post.postId}
                                size={{ md: 4 }}
                                sx={{
                                    height: "250px",
                                    "& img": {
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        border: "none", // Loại bỏ border nếu có
                                    },
                                }}
                            >
                                <UserPost key={post.postId} post={post} />
                            </Grid2>
                        </RouterLink>
                    ))}
                </>
            )}
        </Grid2>
    );
};

export default UserPostGallery;

const NoPostsFound = () => {
    return (
        <Stack alignItems="center" textAlign="center" mt={10}>
            <Typography variant="h6">No Posts Yet🤔</Typography>
        </Stack>
    );
};