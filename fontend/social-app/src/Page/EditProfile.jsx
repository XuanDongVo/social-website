import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import AvatarUser from '../Component/Avatar/AvatarUser';
import { AuthContext } from '../Contexts/AuthContext';
import { findUserById, changeprofileImage, upateProfile } from '../Api/User/User';
import { uploadFile } from '../Api/File/File';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const EditProfile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');

    const fileInputRef = useRef(null);

    const handleOpenFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Fetch profile từ API và cập nhật state form
    const fetchProfile = async () => {
        try {
            const response = await findUserById(user.id);
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
        }
    }, [user?.id]);

    // Cập nhật giá trị các input khi profile thay đổi
    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setBio(profile.bio || '');
        }
    }, [profile]);

    // Hàm xử lý thay đổi ảnh đại diện
    const handleChangeProfile = async (e) => {
        const fileImage = e.target.files[0];
        if (!fileImage) return;
        try {
            setLoading(true);
            const response = await uploadFile({ files: [fileImage] });
            await changeprofileImage(response.data, user.id);
            await fetchProfile();
        } catch (error) {
            console.error("Error updating profile image:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật thông tin profile
    const handleUpdateProfile = async () => {
        const data = {
            id: user.id,
            firstName,
            lastName,
            bio
        };
        try {
            await upateProfile(data);
            await fetchProfile();
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: '50px',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, color: '#262626', marginBottom: '20px' }}
            >
                Edit profile
            </Typography>

            {/* Profile Photo Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '30px',
                    borderRadius: '20px',
                    border: '1px solid #dbdbdb',
                    padding: '10px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                    }}
                >
                    <AvatarUser
                        profilePicURL={profile?.profilePicture || user?.profilePicture}
                        size={58}
                    />
                    <Typography variant='body1' sx={{ marginLeft: "15px", fontWeight: 'bolder' }}>
                        {profile?.firstName} {profile?.lastName}
                    </Typography>
                </Box>
                {/* Input file ẩn để chọn ảnh */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleChangeProfile}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenFileInput}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#0095f6',
                        '&:hover': { backgroundColor: '#007bb5' },
                        padding: '5px 15px',
                        fontSize: '14px',
                        borderRadius: '10px',
                    }}
                >
                    {loading ? <CircularProgress color="success" size={24} /> : 'Change Profile Photo'}
                </Button>
            </Box>

            {/* Website Section */}
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600, color: '#262626', marginBottom: '6px' }}
            >
                Website
            </Typography>
            <TextField
                fullWidth
                placeholder="Website"
                variant="outlined"
                disabled
                sx={{
                    borderRadius: '20px',
                    marginBottom: '10px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#dbdbdb' },
                        '&:hover fieldset': { borderColor: '#b2b2b2' },
                        '&.Mui-disabled fieldset': { borderColor: '#dbdbdb' },
                        borderRadius: '15px'
                    },
                }}
            />
            <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ color: '#8e8e8e', fontSize: '12px', lineHeight: '16px' }}
            >
                Editing your links is only available on mobile. Visit the Instagram app and edit profile to change the websites in your bio.
            </Typography>

            {/* Bio Section */}
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600, color: '#262626', marginBottom: '6px' }}
            >
                Bio
            </Typography>
            <TextField
                fullWidth
                placeholder="Nói thêm về bạn..."
                variant="outlined"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
                rows={3}
                inputProps={{ maxLength: 150 }}
                sx={{
                    marginBottom: '10px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#dbdbdb' },
                        '&:hover fieldset': { borderColor: '#b2b2b2' },
                        borderRadius: '20px'
                    },
                }}
            />

            {/* First Name Section */}
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600, color: '#262626', marginBottom: '6px' }}
            >
                First Name
            </Typography>
            <TextField
                fullWidth
                placeholder="Enter your first name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{
                    marginBottom: '10px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#dbdbdb' },
                        '&:hover fieldset': { borderColor: '#b2b2b2' },
                        borderRadius: '15px'
                    },
                }}
            />

            {/* Last Name Section */}
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600, color: '#262626', marginBottom: '6px' }}
            >
                Last Name
            </Typography>
            <TextField
                fullWidth
                placeholder="Enter your last name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{
                    marginBottom: '20px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#dbdbdb' },
                        '&:hover fieldset': { borderColor: '#b2b2b2' },
                        borderRadius: '15px'
                    },
                }}
            />

            {/* Visibility Note */}
            <Typography
                variant="caption"
                display="block"
                gutterBottom
                sx={{ color: '#8e8e8e', fontSize: '12px', marginBottom: '20px' }}
            >
                Certain profile info like name, bio, and links is visible to everyone. See what profile info is visible.
            </Typography>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '800px' }}></div>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleUpdateProfile}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#0095f6',
                        '&:hover': { backgroundColor: '#007bb5' },
                        padding: '7px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                    }}
                >
                    Submit
                </Button>
            </Box>
            {/* Footer */}
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ color: '#8e8e8e', fontSize: '12px' }}
                >
                    Meta About Blog Jobs Help API Privacy Terms Locations Instagram Lite Threads Contact Uploading & Non-Users Meta Verified
                </Typography>
                <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ color: '#8e8e8e', fontSize: '12px', display: 'block' }}
                >
                    English - © 2025 Instagram from XuanDong
                </Typography>
            </Box>

            {/* Snackbar thông báo cập nhật thành công */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Cập nhật thông tin thành công!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditProfile;
