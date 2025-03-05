import React, { useState, useEffect } from "react";
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Drawer,
    Box,
    InputAdornment,
    TextField,
    IconButton,
    CircularProgress,
    Typography,
    List,
    ListItemAvatar,
    Avatar,
    tooltipClasses
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { searchingUser } from "../../Api/User/User";
import { Link } from "react-router-dom";

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

const Search = ({ toggleSidebar, sidebarWidth }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [enableTransition, setEnableTransition] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (sidebarWidth > 55) {
            setEnableTransition(true);
        } else {
            setEnableTransition(false);
        }
    }, [sidebarWidth]);

    const handleClick = () => {
        setOpenDrawer(!openDrawer);
        toggleSidebar(!openDrawer);
    };

    // Gọi API mỗi khi searchValue thay đổi
    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setLoading(true);

        try {
            if (value.trim()) {
                const response = await searchingUser(value);
                setUsers(response.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error searching users:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchValue("");
        setUsers([]);
    }
    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={handleClick}>
                    <CustomTooltip title="Search" placement="bottom-end">
                        <ListItemIcon style={{ minWidth: "40px" }}>
                            <SearchIcon />
                        </ListItemIcon>
                    </CustomTooltip>
                    <ListItemText primary="Search" />
                </ListItemButton>
            </ListItem>

            {/* Search Drawer nằm kế bên Sidebar */}
            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                variant="persistent"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 350,
                        ml: `${sidebarWidth}px`,
                        transition: enableTransition ? "margin-left 0.3s ease" : "none",
                        padding: "20px",
                    },
                }}
            >
                <Box>
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                        Search
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        sx={{
                            backgroundColor: "#f0f0f0",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-root": {
                                height: "36px",
                                fontSize: "12px",
                                "& fieldset": { border: "none" },
                                "&:hover fieldset": { border: "none" },
                                "&.Mui-focused fieldset": { border: "none" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchValue && (
                                <InputAdornment position="end">
                                    <IconButton onClick={clearSearch}>
                                        {loading ? <CircularProgress size={20} /> : <CloseIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Hiển thị danh sách người dùng */}
                    <List sx={{ mt: 2 }}>
                        {loading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress size={30} />
                            </Box>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <Link to={`/profile/${user.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <ListItem key={user.id} sx={{ padding: "8px 0" }}>
                                        <ListItemAvatar>
                                            <Avatar src={user.profilePicURL} alt={`${user.firstName} ${user.lastName}`} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${user.firstName} ${user.lastName}`}
                                        />
                                    </ListItem>
                                </ Link>
                            ))
                        ) : searchValue && (
                            <Typography variant="body2" color="text.secondary" align="center">
                                No results found
                            </Typography>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Search;