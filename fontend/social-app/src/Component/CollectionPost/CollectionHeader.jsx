import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const CollectionHeader = ({ userId, collectionName, onOpenDialog }) => {
    return (
        <>
            {/* Back to Saved */}
            <Link to={`/profile/${userId}/saved`} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit", opacity: 0.7 }}>
                <ArrowBackIosIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>Saved</Typography>
            </Link>

            {/* Collection Name & More Options */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">{collectionName}</Typography>
                <IconButton onClick={onOpenDialog}>
                    <MoreVertIcon />
                </IconButton>
            </Box>
        </>
    );
};

export default CollectionHeader;
