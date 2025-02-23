import React, { useState } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { likePost } from "../../Api/Like/Like";

const ButtonLike = ({ post, onLikeChange }) => {
    const [isLiked, setIsLiked] = useState(post?.selfLike);

    const tooggleLikePost = async () => {
        const newLikedState = !isLiked;
        await likePost(post.postId);
        setIsLiked(newLikedState);
        onLikeChange(newLikedState);
    }


    return (
        <>
            <IconButton onClick={tooggleLikePost} sx={{ padding: 0.5 }}>
                <FavoriteIcon color={isLiked ? "error" : "default"} />
            </IconButton>
        </>
    )


}

export default ButtonLike;