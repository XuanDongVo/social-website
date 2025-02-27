import { Box, Tabs, Tab } from "@mui/material";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import { useContext } from "react";

const ProfileTabs = ({ userId }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Xác định tab nào đang active dựa vào pathname
    const getValue = () => {
        if (location.pathname === `/profile/${userId}`) return 1;
        if (location.pathname === `/profile/${userId}/saved`) return 2;
        return false; // Mặc định không chọn tab nào nếu không khớp
    };

    const visitingAnotherProfileAndAuth = userId !== user.id;

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider", pt: 1 }}>
            <Tabs
                value={getValue()}
                centered
                sx={{
                    "& .MuiTab-root": {
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        minWidth: 100,
                        fontSize: "0.75rem",
                        px: 1,
                    },
                    "& .MuiTabs-flexContainer": {
                        gap: 5,
                        justifyContent: "center",
                    },
                }}
            >
                <Tab
                    icon={<GridOnIcon fontSize="small" />}
                    label="Posts"
                    component={Link}
                    to={`/profile/${userId}`}
                    value={1}
                />
                {!visitingAnotherProfileAndAuth && <Tab
                    icon={<BookmarkBorderIcon fontSize="small" />}
                    label="Saved"
                    component={Link}
                    to={`/profile/${userId}/saved`}
                    value={2}
                />}

                {!visitingAnotherProfileAndAuth && <Tab
                    icon={<FavoriteBorderIcon fontSize="small" />}
                    label="Likes"
                    component={Link}
                    to={`/profile/${userId}/likes`}
                    value={3}
                />}
            </Tabs>
        </Box>
    );
};

export default ProfileTabs;
