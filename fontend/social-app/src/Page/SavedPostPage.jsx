import { Container, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import SavedPostList from "../Component/SavedPost/SavedPostList";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from "react-router-dom"
const SavePostPage = () => {
    const { userId } = useParams();

    return (
        <Container maxWidth="lg" sx={{ marginTop: 0.5 }}>

            <Box display="flex" flexDirection="column" gap={0.5}>
                <Link to={`/profile/${userId}/saved`} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit", opacity: 0.7 }}>
                    <ArrowBackIosIcon fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>Saved</Typography>
                </Link>
                <Typography variant="h6" fontWeight="bold">All Posts</Typography>
            </Box>

            <Box sx={{ maxWidth: "100%", mx: "auto" }}>
                <SavedPostList userId={userId} />
            </Box>
        </Container >
    );
};

export default SavePostPage;

