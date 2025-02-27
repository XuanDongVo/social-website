import { Dialog, Button, Stack } from "@mui/material";

const CollectionDialog = ({ open, onClose, onDelete, onOpenEdit, onOpenSaved }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
            <Stack spacing={0} sx={{ p: 0 }}>
                <Button variant="text" sx={{ fontSize: 14, fontWeight: "bold", color: "red", py: 1.5, borderBottom: "1px solid #ddd", borderRadius: 0 }} onClick={onDelete}>
                    Delete collection
                </Button>
                <Button variant="text" sx={{ fontSize: 14, py: 1.5, borderBottom: "1px solid #ddd", borderRadius: 0 }} onClick={onOpenSaved}>
                    Add from saved
                </Button>
                <Button variant="text" sx={{ fontSize: 14, py: 1.5, borderBottom: "1px solid #ddd", borderRadius: 0 }} onClick={onOpenEdit}>
                    Edit collection
                </Button>
                <Button variant="text" sx={{ fontSize: 14, py: 1.5, borderRadius: 0 }} onClick={onClose}>
                    Cancel
                </Button>
            </Stack>
        </Dialog>
    );
};

export default CollectionDialog;
