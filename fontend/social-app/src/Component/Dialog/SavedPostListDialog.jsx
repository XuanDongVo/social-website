import React, { useEffect, useState } from "react";
import {
    Grid, Box, CardMedia, Typography, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getSavedPosts } from "../../Api/SavedPost/SavedPost";
import { useParams } from "react-router-dom";
import { addSavedPostInCollection, createNewCollection } from "../../Api/Collection/Collection";

const SavedPostListDialog = ({ open, handleCloseDialog, onReload, collectionName }) => {
    const { collectionId } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPostIds, setSelectedPostIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await getSavedPosts(0);
                setPosts(response.data.content);
            } catch (error) {
                console.error("Lỗi khi lấy bài viết:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleSelectImage = (postId) => {
        setSelectedPostIds((prevSelected) =>
            prevSelected.includes(postId)
                ? prevSelected.filter((id) => id !== postId)
                : [...prevSelected, postId]
        );
    };

    const handleSubmitDone = async () => {
        if (selectedPostIds.length === 0) {
            handleCloseDialog();
            return;
        }
        setIsSubmitting(true);
        if (collectionId) {
            await addSavedPostInCollection(collectionId, selectedPostIds);

        } else {
            await createNewCollection(collectionName, selectedPostIds)

        }
        await onReload();
        setIsSubmitting(false);
        handleCloseDialog();
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 1 }}>
                <IconButton onClick={handleCloseDialog} size="small">
                </IconButton>
                <Typography variant="body1" fontWeight="bold">Add from Saved</Typography>
                <IconButton onClick={handleCloseDialog} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ minHeight: 300, maxHeight: 500, overflowY: "auto" }}>
                {isLoading ? (
                    <Typography textAlign="center" variant="body2">Loading...</Typography>
                ) : posts.length > 0 ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {posts.map((post) => (
                            <CardImage
                                key={post.postId}
                                post={post}
                                isSelected={selectedPostIds.includes(post.postId)}
                                onSelect={handleSelectImage}
                            />
                        ))}
                    </Box>
                ) : (
                    <Typography textAlign="center" variant="body2">No saved posts found.</Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleSubmitDone}
                    fullWidth
                    variant="text"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={20} /> : "Done"}
                </Button>
            </DialogActions>
        </Dialog >
    );
};

const CardImage = ({ post, isSelected, onSelect }) => {
    return (
        <Box
            onClick={() => onSelect(post.postId)}
            sx={{
                position: "relative",
                cursor: "pointer",
                width: '50%',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CardMedia
                component="img"
                image={post.images[0]}
                alt="Post Image"
                sx={{
                    objectFit: "contain",
                    borderRadius: 1,
                    opacity: isSelected ? 0.6 : 1,
                }}
            />
            {isSelected && (
                <CheckCircleIcon
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "50%",
                        fontSize: 30,
                    }}
                />
            )}
        </Box>
    );
};

export default SavedPostListDialog;
