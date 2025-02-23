import { Skeleton, Typography, Stack, Grid2 } from "@mui/material";
import ProfilePost from "../Profile/ProfilePost";
import { useCallback, useEffect, useState } from "react";
import { getSelfPosts, deletePost } from "../../Api/Post/Post";
import { useParams } from "react-router-dom";


const ProfilePosts = () => {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getSelfPosts({ userId, page: 1 });
            setPosts(response.data.content);
        } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);


    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, userId]);

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId);
            fetchPosts();
        } catch (error) {
            console.error("Lỗi khi xóa bài viết", error);
        }
    };



    if (!posts || posts.length === 0) {
        return <NoPostsFound />;
    }

    return (
        <Grid2 container spacing={0.5} sx={{ width: "100%", margin: "0 auto" }}>
            {isLoading &&
                [0, 1, 2].map((_, idx) => (
                    <Grid2 size={{ xs: 2, sm: 4, md: 4 }} key={idx}>
                        <Skeleton variant="rectangular" width="100%" height={300} />
                    </Grid2>
                ))}

            {!isLoading && (
                <>
                    {posts?.map((post) => (
                        <Grid2 key={post.postId} size={{ xs: 2, sm: 4, md: 4 }} sx={{
                            height: "250px",
                            "& img": { width: "100%", height: "100%" }
                        }}  >
                            <ProfilePost key={post.postId} post={post} onDelete={handleDeletePost} />
                        </Grid2>
                    ))}
                </>
            )}
        </Grid2>
    );
};

export default ProfilePosts;

const NoPostsFound = () => {
    return (
        <Stack alignItems="center" textAlign="center" mt={10}>
            <Typography variant="h6">No Posts Yet🤔</Typography>
        </Stack>
    );
};
