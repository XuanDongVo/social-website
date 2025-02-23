import React, { useState, useRef } from "react";
import {
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button, Box
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import { savePost, unSavePost } from "../../Api/SavedPost/SavedPost";

const ButtonSavedPost = ({ post }) => {
    const isSavedRef = useRef(post.savedPost || false);
    const [isSaved, setIsSaved] = useState(isSavedRef.current);
    const [open, setOpen] = useState(false);

    const toggleSavePost = () => {
        const newSavedState = !isSaved;
        if (!newSavedState) {
            setOpen(true);
        } else {
            handleSavePost();
        }
    };

    const handleSavePost = async () => {
        await savePost(post.postId);
        isSavedRef.current = true;
        setIsSaved(true);
    };

    const handleUnSavePost = async () => {
        await unSavePost(post.postId);
        isSavedRef.current = false;
        setIsSaved(false);
        setOpen(false);
    };

    return (
        <>
            <IconButton sx={{ color: isSaved ? "red" : "default" }} onClick={toggleSavePost}>
                <BookmarkBorderIcon />
            </IconButton>

            {/* Dialog xác nhận gỡ lưu bài viết */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <Box sx={{ borderRadius: 3, overflow: "hidden" }}> {/* Làm mềm góc Dialog */}
                    {/* Header với nút đóng */}
                    <DialogTitle
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingBottom: 0,
                        }}
                    >
                        <IconButton onClick={() => setOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    {/* Nội dung chính */}
                    <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
                        <DialogContentText
                            sx={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#333",
                                lineHeight: 1.5,
                                maxWidth: "100%",
                            }}
                        >
                            Remove From Saved and Collections?
                        </DialogContentText>
                    </DialogContent>

                    {/* Các nút hành động */}
                    <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="outlined"
                            sx={{
                                flex: 1,
                                mr: 1,
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUnSavePost}
                            variant="contained"
                            color="error"
                            sx={{
                                flex: 1,
                                borderRadius: 2,
                                textTransform: "none",
                                boxShadow: "none",
                            }}
                        >
                            Remove
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
};

export default ButtonSavedPost;
