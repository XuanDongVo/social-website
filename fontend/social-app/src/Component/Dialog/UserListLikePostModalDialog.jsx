import React, { useRef, useEffect, useState, useContext } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    TextField,
    List,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem";
import { followUser } from "../../Api/Follow/Follow";
import { getListLikePost } from "../../Api/Like/Like";
import { AuthContext } from "../../Contexts/AuthContext";

const UserListLikePostModalDialog = ({ open, onClose, postId }) => {
    const { user: currentUser } = useContext(AuthContext); // Người dùng hiện tại (người đăng bài)
    const [users, setUsers] = useState([]);
    const followStatuses = useRef({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getListLikePost(postId);
                const fetchedUsers = response.data || [];
                setUsers(fetchedUsers);

                // Khởi tạo followStatuses từ followingBack, bỏ qua người dùng hiện tại
                const initialStatuses = {};
                fetchedUsers.forEach((user) => {
                    const userId = user?.follow?.id;
                    // Chỉ lưu trạng thái cho những người khác, không phải người dùng hiện tại
                    if (userId !== currentUser.id) {
                        initialStatuses[userId] = user.followingBack || false;
                    }
                });
                followStatuses.current = initialStatuses;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng like bài viết:", error);
            }
        };
        fetchUsers();
    }, [postId, currentUser.id]); // Thêm currentUser.id vào dependency để re-run khi user thay đổi

    const handleFollow = async (userId) => {
        try {
            await followUser(userId);
            followStatuses.current[userId] = !followStatuses.current[userId];

        } catch (error) {
            console.error("Lỗi khi follow/unfollow:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div />
                Likes
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "grey.500",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                    {users.map((user) => {
                        const userId = user.follow.id;
                        const isFollowing = followStatuses.current[userId] || false;
                        const isCurrentUser = user.follow.id === currentUser.id; // Kiểm tra nếu là người dùng hiện tại
                        return (
                            <UserListItem
                                key={userId}
                                user={user}
                                actionButtonText={isCurrentUser ? "Liked" : (isFollowing ? "Unfollow" : "Following")}
                                onAction={() => handleFollow(userId)}
                                disableAction={isCurrentUser} // Vô hiệu hóa nút nếu là người dùng hiện tại
                            />
                        );
                    })}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default UserListLikePostModalDialog;