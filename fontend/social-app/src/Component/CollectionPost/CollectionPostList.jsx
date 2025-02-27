import { Typography, Stack, Box, Skeleton, Grid } from "@mui/material";
import SavePost from "../SavedPost/SavePost";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SavedPostListDialog from "../Dialog/SavedPostListDialog";
import { useState } from "react";

const CollectionPostList = ({ collection, fetchPosts, isLoading }) => {
    if (!collection || collection.length === 0) {
        return <NoSavedPostsFound onReload={fetchPosts} />;
    }

    return (
        <Box display="flex" gap={1} flexDirection="column">
            <Grid container spacing={0.5} sx={{ width: "100%", margin: "0 auto" }}>
                {isLoading &&
                    [0, 1, 2].map((_, idx) => (
                        <Grid item xs={6} sm={4} md={3} key={idx}>
                            <Skeleton variant="rectangular" width="100%" height={250} />
                        </Grid>
                    ))}

                {!isLoading &&
                    collection?.posts?.map((post) => (
                        <Grid item xs={6} sm={4} md={3} key={post.postId}>
                            <SavePost key={post.postId} post={post} onDelete={fetchPosts} />
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};

export default CollectionPostList;

const NoSavedPostsFound = ({ onReload }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Stack alignItems="center" textAlign="center" mt={10} spacing={1.5}>
                <Box sx={{ width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid black" }}>
                    <BookmarkBorderIcon fontSize="large" />
                </Box>
                <Typography variant="h5" fontWeight="bold">Start Saving</Typography>
                <Typography variant="body2">Save photos and videos to your collection.</Typography>
                <Typography color="primary" fontWeight="bold" onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
                    Add to collection
                </Typography>
            </Stack>

            {open && <SavedPostListDialog open={open} onClose={() => setOpen(false)} onReload={onReload} />}
        </>
    );
};
