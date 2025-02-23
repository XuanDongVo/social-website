import React, { useState, useEffect } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Drawer, Box, InputAdornment, TextField, IconButton, CircularProgress, tooltipClasses } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";


// Custom Tooltip
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#fff", // Nền trắng
        color: "#000", // Chữ đen
        border: "1px solid #dbdbdb", // Viền xám nhẹ
        fontSize: "14px",
        boxShadow: theme.shadows[1],
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#fff", // Đổi màu của mũi tên
    },
}));

const Search = ({ toggleSidebar, sidebarWidth }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [enableTransition, setEnableTransition] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setLoading(true);

        setTimeout(() => setLoading(false), 1000);
    };

    const clearSearch = () => {
        setSearchValue("");
    };

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
                        width: 300,
                        ml: `${sidebarWidth}px`,
                        transition: enableTransition ? "margin-left 0.3s ease" : "none",
                        padding: "20px",
                    },
                }}
            >
                <Box>
                    <h6 style={{ marginBottom: "10px" }}>Search</h6>
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
                </Box>
            </Drawer>
        </>
    );
};

export default Search;
