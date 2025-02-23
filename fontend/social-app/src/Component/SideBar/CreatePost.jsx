import React, { useState, useRef, useEffect } from "react";
import {
    ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, tooltipClasses, Dialog,
    DialogTitle, DialogContent, DialogActions, Button, Typography, Divider, Container, MobileStepper, Box, IconButton, TextField
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { styled } from "@mui/material/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiPicker from 'emoji-picker-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { createPost } from "../../Api/Post/Post";
import { uploadFile } from "../../Api/File/File";
import SwiperImage from "../SwiperImage/SwiperImage";


// Custom Tooltip
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #dbdbdb",
        fontSize: "14px",
        boxShadow: theme.shadows[1],
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#fff",
    },
}));

const CreatePost = () => {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [showImageGrid, setShowImageGrid] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [caption, setCaption] = useState("");
    const [previewImages, setPreviewImages] = useState([]);

    const handleCaptionChange = (event) => {
        setCaption(event.target.value);
    };


    const handleEmojiClick = (emojiObject) => {
        setCaption((prev) => prev + emojiObject.emoji);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setActiveStep(0);
        setImages([]);
        setCaption("");
    };

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        if (images.length === 1) setActiveStep(0);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > 10) return;
        const newImages = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newImages]);
        setImages(prev => [...prev, ...files]);
        setActiveStep(1);
    };

    useEffect(() => {
        const handleProcess = async () => {
            if (activeStep === 0) {
                setImages([]);
                setPreviewImages([]);
                setCaption("");
            }
            if (activeStep === 3) {
                await handleUploadPost();
                handleClose();
            }
        };

        handleProcess();
    }, [activeStep]);

    const handleUploadPost = async () => {
        const response = await uploadFile({ files: images });
        await createPost({ caption, images: response.data });
    };





    return (
        <>
            <ListItem disablePadding onClick={handleOpen}>
                <ListItemButton>
                    <CustomTooltip title="Create" placement="bottom-end">
                        <ListItemIcon style={{ minWidth: '40px' }}><AddBoxIcon /></ListItemIcon>
                    </CustomTooltip>
                    <ListItemText primary="Create" />
                </ListItemButton>
            </ListItem>


            <Dialog onClose={handleClose} open={open} fullWidth maxWidth="md" sx={{
                "& .MuiDialog-paper": {
                    height: "80vh",
                    maxHeight: "80vh",
                    borderRadius: "2rem"
                },
            }}>
                <DialogTitle sx={{ textAlign: "center", p: 1 }}>Create new post</DialogTitle>
                <Divider />

                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />

                {activeStep === 0 && (
                    <Container sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <DialogContent sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            width: "100%",
                        }}>
                            <PhotoCameraIcon sx={{ fontSize: 60, color: "gray", mb: 2 }} />
                            <Typography gutterBottom>
                                Drag photos and videos here
                            </Typography>



                            <DialogActions>
                                <Button onClick={handleFileSelect} variant="contained">
                                    Select from computer
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    </Container>
                )}

                {activeStep > 0 ? <MobileStepper
                    variant="dots"
                    steps={3}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button size="small" onClick={() => setActiveStep(activeStep + 1)}>
                            Next <ArrowForwardIcon />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={() => setActiveStep(activeStep - 1)}>
                            <ArrowBackIcon /> Back
                        </Button>
                    }
                /> : null}
                {activeStep === 1 && (
                    <>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                height: "100%",
                                background: "black",
                                overflow: "hidden",
                                position: "relative",

                            }}
                        >
                            <SwiperImage images={previewImages} />

                            <IconButton
                                sx={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                    zIndex: 1302,
                                    background: "rgba(255,255,255,0.8)",
                                    "&:hover": { background: "rgba(255, 255, 255, 0.8)" },
                                    color: showImageGrid ? "red" : "default"
                                }}
                                onClick={() => setShowImageGrid(!showImageGrid)}
                            >
                                <FilterNoneIcon />
                            </IconButton>
                        </Box>


                        {showImageGrid && (
                            <Container sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 1, p: 2 }}>
                                {previewImages.map((img, index) => (
                                    <div key={index} style={{ position: "relative" }}>
                                        <img src={img} alt="Preview" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                                        <IconButton size="small" sx={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.5)", color: "white", zIndex: 1305 }} onClick={() => removeImage(index)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                ))}
                                {previewImages.length < 10 && (
                                    <Button variant="outlined" fullWidth onClick={handleFileSelect}>Add More</Button>
                                )}
                            </Container>
                        )}


                    </>

                )}

                {activeStep === 2 && (
                    <Box sx={{ display: "flex", height: "100vh" }}>
                        {/* Phần bên trái chiếm 2/3 */}
                        <Box
                            sx={{
                                flex: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "black",
                                height: "100%",
                                width: "66.66%", // Đảm bảo nó chiếm 2/3
                            }}
                        >
                            <SwiperImage images={previewImages} />
                        </Box>

                        {/* Phần bên phải chiếm 1/3 */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                backgroundColor: "white",
                                padding: 2,
                                width: "33.33%",
                            }}
                        >
                            {/* Caption và Emoji Picker */}
                            <Box sx={{ position: "relative", display: "flex", gap: 2, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    placeholder="Caption..."
                                    variant="standard"
                                    size="small"
                                    multiline
                                    sx={{ mb: 2 }}
                                    onChange={handleCaptionChange}
                                    value={caption}
                                />
                                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <SentimentSatisfiedAltIcon color={showEmojiPicker ? "primary" : "default"} />
                                </IconButton>

                                {showEmojiPicker && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: "100%",
                                            top: 30,
                                            right: 10,
                                            zIndex: 10,
                                            background: "white",
                                            borderRadius: "8px",
                                            boxShadow: 3,
                                            mt: 1,
                                        }}
                                    >
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                )}

            </Dialog>
        </>
    )
}

export default CreatePost;




