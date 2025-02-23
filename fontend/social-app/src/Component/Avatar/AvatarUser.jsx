import React from "react";
import { Avatar as MuiAvatar, Box } from "@mui/material";
import { Height } from "@mui/icons-material";

const AvatarUser = ({ profilePicURL, hasStory, seenStory, size }) => {


    return (
        <Box
            sx={{
                // width: 60,
                // height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `3px solid ${hasStory ? (seenStory ? "#ccc" : "#ff4500") : "transparent"}`,
                padding: "3px",
            }}
        >
            <MuiAvatar src={profilePicURL || "https://fakeimg.pl/440x320/?text=Image"} sx={{ width: size, height: size }} />
        </Box>
    );
};

export default AvatarUser;
