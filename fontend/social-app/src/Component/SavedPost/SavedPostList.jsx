import { Skeleton, Typography, Stack, Box, Button, Grid2 } from "@mui/material";
import SavePost from "./SavePost";
import { useCallback, useEffect, useState } from "react";
import { getSavedPosts } from "../../Api/SavedPost/SavedPost";
import { deletePost } from "../../Api/Post/Post";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SavedPostListDialog from "../Dialog/SavedPostListDialog";


const SavedPostList = ({ userId }) => {

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getSavedPosts(0);
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
        return <NoSavedPostsFound />;
    }

    return (
        <Box display="flex" gap={1} flexDirection="column">



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
                                <SavePost key={post.postId} post={post} onDelete={handleDeletePost} />
                            </Grid2>
                        ))}
                    </>
                )}
            </Grid2>
        </Box>
    );
};

export default SavedPostList;

const NoSavedPostsFound = () => {
    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Stack alignItems="center" textAlign="center" mt={10} spacing={1.5}>
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid black",
                    }}
                >
                    <BookmarkBorderIcon fontSize="large" />
                </Box>
                <Typography variant="h5" fontWeight="bold">Start Saving</Typography>
                <Typography variant="body2">Save photos and videos to your collection.</Typography>
                <Button
                    onClick={handleOpenDialog}
                    style={{ textDecoration: "none", color: "#1877F2", fontWeight: "bold" }}
                >
                    Add to collection
                </Button>
            </Stack>

            {open && <SavedPostListDialog open={open} handleCloseDialog={handleCloseDialog} />}



        </>
    );
};

