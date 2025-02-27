import { Box, Container, Skeleton, Stack, Typography, Button, Divider } from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import FeedPost from "./FeedPost";
import { getNewsFeed } from "../../Api/Post/Post";

const FeedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0); // Bắt đầu từ trang 0
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // Kiểm tra còn bài viết không

    const observer = useRef();

    // Gọi API lấy danh sách bài viết
    const fetchPosts = useCallback(async () => {
        if (!hasMore) return;

        setIsLoading(true);
        try {
            const response = await getNewsFeed({ page });
            const newPosts = response.data;

            setPosts((prev) => [...prev, ...newPosts]);

            // Nếu trả về < 12 post thì không còn dữ liệu để load
            if (newPosts.length < 12) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore]);

    // Lần đầu load danh sách bài viết
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Xử lý khi cuộn xuống gần hết trang thì tải thêm bài viết
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

    return (
        <Container maxWidth="sm" sx={{ py: 5, px: 2 }}>
            {/* Hiển thị Skeleton khi đang loading lần đầu */}
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

            {/* Hiển thị danh sách bài viết */}
            {posts.map((post, index) => {
                if (index === posts.length - 1) {
                    return <FeedPost key={post.postId} post={post} ref={lastPostRef} />;
                }
                return <FeedPost key={post.id} post={post} />;
            })}



            {/* Skeleton Loading khi đang tải thêm */}
            {isLoading && posts.length > 0 && (
                <Stack spacing={2} sx={{ mt: 3 }}>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                    <Skeleton variant="rectangular" width="100%" height={100} />
                </Stack>
            )}

            {/* Nếu không còn bài viết nào để tải */}
            {!hasMore && (<>
                <Box display="flex" flexDirection="column" alignItems="center" >
                    <Box component="img" src="/illo-confirm-refresh-light.png" sx={{ width: 100, height: 100 }} />
                    <Typography variant="body" align="center" sx={{ mt: 2 }}>
                        🚀 You're all caught up
                    </Typography>
                </Box>
            </>
            )
            }

            {/* Suggest feed post*/}

        </Container >
    );
};

export default FeedPosts;
