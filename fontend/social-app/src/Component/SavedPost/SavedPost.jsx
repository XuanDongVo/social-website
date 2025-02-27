import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, Typography, Button, Box, Dialog, Divider, Stack, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getPreviewCollections } from "../../Api/Collection/Collection"
import { getPreviewSavedPost } from "../../Api/SavedPost/SavedPost";
import SavedPostListDialog from "../Dialog/SavedPostListDialog";


// Component hiển thị Saved Post và Collection Item
const ImageCard = ({ data, onClick }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                width: 250,
                height: 250,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
                "&:hover .overlay": {
                    opacity: 0,
                },
            }}
        >
            {/* Hiển thị 4 ảnh nếu có */}
            {data?.images?.length > 0 ? (
                <Grid container spacing={0} sx={{ height: "100%" }}>
                    {data.images.map((img, i) => (
                        <Grid item xs={6} key={i} sx={{ height: "50%" }}>
                            <CardMedia
                                component="img"
                                image={img}
                                alt={`Image ${i}`}
                                sx={{ width: "100%", height: "100%" }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(to bottom, white, gray)",
                    }}
                >
                    {/* <Typography variant="h6">{data.title}</Typography> */}
                </Box>
            )}

            {/* Overlay xám mờ */}
            <Box
                className="overlay"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)", // Màu xám mờ
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Tiêu đề ở góc trái dưới */}
            <Typography
                variant="subtitle1"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    padding: "8px",
                    textAlign: "left",
                    color: "white",
                }}
            >
                {data?.name}
            </Typography>
        </Card>
    );
};

// Component chính
const SavedPost = () => {
    const [stepOneOpen, setStepOneOpen] = useState(false);  // Dialog bước 1
    const [open, setOpen] = useState(false);  // Dialog bước 2
    const [collectionName, setCollectionName] = useState("");
    const [savedPost, setSavedPost] = useState(null);
    const [collections, setCollections] = useState([]);

    const { userId } = useParams();
    const navigate = useNavigate();

    // Fetch dữ liệu bài viết đã lưu
    useEffect(() => {
        const fetchSavedPosts = async () => {
            const response = await getPreviewSavedPost();
            setSavedPost(response.data);
        };
        fetchSavedPosts();
    }, [userId]);

    const fetchCollections = async () => {
        const response = await getPreviewCollections();
        setCollections(Array.isArray(response.data) ? response.data : []);
    };

    // Gọi trong useEffect
    useEffect(() => {
        fetchCollections();
    }, [userId]);

    // Xử lý mở dialog bước 1
    const handleOpenDialog = () => {
        setStepOneOpen(true);
    };

    // Xử lý khi nhấn Next để sang bước 2
    const handleNextStep = () => {
        if (!collectionName.trim()) {
            alert("Please enter a collection name!");
            return;
        }
        setStepOneOpen(false);
        setOpen(true);
    };

    // Đóng dialog
    const handleCloseDialog = () => {
        setStepOneOpen(false);
        setOpen(false);
    };

    // Xử lý điều hướng đến danh sách bài viết đã lưu
    const handleSavedPostList = () => {
        navigate(`/profile/${userId}/saved/all-posts`);
    };

    // Xử lý điều hướng đến bộ sưu tập cụ thể
    const handleCollection = (id, collecionName) => {
        navigate(`/profile/${userId}/saved/${collecionName}/${id}`);
    };

    return (
        <>
            <Box sx={{ padding: "20px" }}>
                {/* Tiêu đề và nút mở dialog */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="textSecondary">
                        Only you can see what you've saved
                    </Typography>
                    <Button sx={{ color: "blue" }} onClick={handleOpenDialog}>
                        + New Collection
                    </Button>
                </Box>

                {/* Danh sách bài viết và bộ sưu tập */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: "20px" }}>
                    {/* Bài viết đã lưu */}
                    <ImageCard data={savedPost} onClick={handleSavedPostList} />

                    {/* Các bộ sưu tập */}
                    {collections?.map((collection, index) => (
                        <ImageCard
                            key={index}
                            data={collection}
                            onClick={() => handleCollection(collection.collectionId, collection.name)}
                        />
                    ))}
                </Box>
            </Box>

            {/* Dialog Bước 1: Nhập tên bộ sưu tập */}
            <Dialog open={stepOneOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <Box p={1} textAlign="center">
                    <Typography variant="h6" fontWeight="bold">
                        Create New Collection
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter collection name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" justifyContent="flex-end" mt={2} gap={2}>
                        <Button onClick={handleCloseDialog} color="inherit" sx={{ fontWeight: "bold" }}>
                            Cancel
                        </Button>
                        <Button onClick={handleNextStep} variant="contained" sx={{ fontWeight: "bold" }}>
                            Next
                        </Button>
                    </Stack>
                </Box>
            </Dialog>

            {/* Dialog Bước 2: Chọn bài viết */}
            {open && <SavedPostListDialog open={open} handleCloseDialog={handleCloseDialog} onReload={fetchCollections} collectionName={collectionName} />}
        </>
    );
};
export default SavedPost;
