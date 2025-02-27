import { Dialog, Box, Typography, Button, Stack, Divider, TextField } from "@mui/material";

const EditCollectionDialog = ({ open, onClose, collectionName, setCollectionName, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
            <Box p={3} textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                    Edit Collection
                </Typography>

                <Divider sx={{ my: 2 }} />

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter new name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                        },
                    }}
                />

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="flex-end" mt={2} gap={2}>
                    <Button onClick={onClose} color="inherit" sx={{ fontWeight: "bold" }}>
                        Cancel
                    </Button>
                    <Button onClick={onSave} variant="contained" sx={{ fontWeight: "bold" }}>
                        Save
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
};

export default EditCollectionDialog;
