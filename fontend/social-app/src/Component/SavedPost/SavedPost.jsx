import React from "react";
import { Grid, Card, CardMedia, Typography, Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

// Fake Data
const savedPost = {
    title: "Saved Posts",
    images: [
        "https://fakeimg.pl/440x320/?text=Image",
        "https://fakeimg.pl/440x320/?text=Image",
        "https://fakeimg.pl/440x320/?text=Image",
        "https://fakeimg.pl/440x320/?text=Image",
    ],
};

const collections = [
    {
        title: "Collection 1",
        images: [
            "https://fakeimg.pl/440x320/?text=Image",
            "https://fakeimg.pl/440x320/?text=Image",
            "https://fakeimg.pl/440x320/?text=Image",
            "https://fakeimg.pl/440x320/?text=Image",
        ],
    },
    {
        title: "Collection 2",
        images: [],
    }, {
        title: "Collection 2",
        images: [],
    }, {
        title: "Collection 2",
        images: [],
    }
];

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
            {data.images.length > 0 ? (
                <Grid container spacing={0} sx={{ height: "100%" }}>
                    {data.images.slice(0, 4).map((img, i) => (
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
                {data.title}
            </Typography>
        </Card>
    );
};

// Component chính
const SavedPost = () => {
    const { userId } = useParams();

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/profile/${userId}/saved/all-posts`);  // Đúng với cấu trúc route
    };


    return (
        <Box sx={{ padding: "20px" }}>
            {/* Tiêu đề và nút */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="textSecondary">
                    Only you can see what you've saved
                </Typography>
                <Button sx={{ color: "blue" }}>+ New Collection</Button>
            </Box>

            {/* Grid chính */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: "20px" }}>
                {/* Saved Post (luôn đứng đầu) */}
                <ImageCard data={savedPost} onClick={() => handleNavigate()} />

                {/* Collection Items (nằm kế bên) */}
                {collections.map((collection, index) => (
                    <ImageCard key={index} data={collection} />
                ))}
            </Box>
        </Box>
    );
};

export default SavedPost;
