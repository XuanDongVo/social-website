import { Box, Container, Skeleton, Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import FeedPost from "./FeedPost";
import { getNewsFeed, markPostAsSeen } from "../../Api/Post/Post";

const FeedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const postObservers = useRef(new Map());

    const fetchPosts = useCallback(async () => {
        if (!hasMore) return;

        setIsLoading(true);
        try {
            const response = await getNewsFeed({ page });
            const newPosts = response.data;

            setPosts((prev) => [...prev, ...newPosts]);

            if (newPosts.length < 12) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const markPostSeen = useCallback((postId) => {
        setTimeout(() => {
            markPostAsSeen(postId);
        }, 60000);
    }, []);

    const setupPostObserver = useCallback(
        (postId) => (node) => {
            if (!node) {
                console.log(`No node for post ${postId}`);
                return;
            }

            console.log(`Setting up observer for post ${postId}`);
            const observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (!entry.isIntersecting) {
                        markPostSeen(postId);
                        observer.disconnect();
                        postObservers.current.delete(postId);
                    }
                },
                { threshold: 0, rootMargin: "0px" }
            );

            observer.observe(node);
            postObservers.current.set(postId, observer);
        },
        [markPostSeen]
    );

    const lastPostRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        return () => {
            postObservers.current.forEach((observer) => observer.disconnect());
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    return (
        <Container maxWidth="sm" sx={{ py: 5, px: 2 }}>
            {isLoading && posts.length === 0 && [0, 1, 2].map((_, idx) => (
                <Stack key={idx} spacing={2} sx={{ mb: 5 }}>
                    <Box display="flex" gap={2}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Stack spacing={1}>
                            <Skeleton variant="text" width={200} height={10} />
                            <Skeleton variant="text" width={200} height={10} />
                        </Stack>
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={400} />
                </Stack>
            ))}

            {posts.map((post, index) => {
                const postId = post.postId || post.id;
                if (index === posts.length - 1) {
                    return (
                        <FeedPost
                            key={postId}
                            post={post}
                            ref={(node) => {
                                lastPostRef(node);
                                setupPostObserver(postId)(node);
                            }}
                        />
                    );
                }
                return <FeedPost key={postId} post={post} ref={setupPostObserver(postId)} />;
            })}

            {isLoading && posts.length > 0 && (
                <Stack spacing={2} sx={{ mt: 3 }}>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                    <Skeleton variant="rectangular" width="100%" height={100} />
                </Stack>
            )}

            {!hasMore && (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box component="img" src="/illo-confirm-refresh-light.png" sx={{ width: 100, height: 100 }} />
                    <Typography variant="body" align="center" sx={{ mt: 2 }}>
                        🚀 You're all caught up
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default FeedPosts;