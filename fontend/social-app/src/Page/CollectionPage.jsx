import { useState, useEffect, useCallback } from "react";
import { Container, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { deleteCollection, getAllSavedPostInCollectionById, modifyNameCollection } from "../Api/Collection/Collection";
import CollectionPostList from "../Component/CollectionPost/CollectionPostList";
import CollectionHeader from "../Component/CollectionPost/CollectionHeader";
import CollectionDialog from "../Component/Dialog/CollectionDialog";
import EditCollectionDialog from "../Component/Dialog/EditCollectionDialog";
import SavedPostListDialog from "../Component/Dialog/SavedPostListDialog";

const CollectionPage = () => {
    const navigate = useNavigate();
    const { userId, collectionName, collectionId } = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [openSavedDialog, setOpenSavedDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [collection, setCollection] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCollectionName, setNewCollectionName] = useState(collectionName);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllSavedPostInCollectionById(collectionId, 0);
            setCollection(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [collectionId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDeleteCollection = async () => {
        try {
            await deleteCollection(collectionId);
            navigate(`/profile/${userId}/saved`);
        } catch (error) {
            console.error("Failed to delete collection:", error);
        }
    };

    const editNameCollection = async () => {
        await modifyNameCollection(collectionId, newCollectionName);
        navigate(`/profile/${userId}/saved/${newCollectionName}/${collectionId}`)
        setOpenEditDialog(false);
    }

    return (
        <Container maxWidth="lg" sx={{ marginTop: 0.5 }}>
            <Box display="flex" flexDirection="column" gap={0.5}>
                {/* Header Component */}
                <CollectionHeader
                    userId={userId}
                    collectionName={collectionName}
                    onOpenDialog={() => setOpenDialog(true)}
                />
            </Box>

            {/* Collection Posts */}
            <Box sx={{ maxWidth: "100%", mx: "auto" }}>
                <CollectionPostList collection={collection} fetchPosts={fetchPosts} isLoading={isLoading} />
            </Box>

            {/* Dialog for actions */}
            <CollectionDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onDelete={handleDeleteCollection}
                onOpenEdit={() => {
                    setOpenEditDialog(true);
                    setOpenDialog(false);
                }}
                onOpenSaved={() => {
                    setOpenSavedDialog(true);
                    setOpenDialog(false);
                }}
            />

            {/* Edit Collection Dialog */}
            <EditCollectionDialog
                open={openEditDialog}
                onClose={() => {
                    setOpenEditDialog(false);
                    setNewCollectionName(collectionName);
                }}
                collectionName={newCollectionName}
                setCollectionName={setNewCollectionName}
                onSave={editNameCollection}
            />


            {/* Add from Saved Dialog */}
            <SavedPostListDialog open={openSavedDialog} handleCloseDialog={() => setOpenSavedDialog(false)} onReload={fetchPosts} />
        </Container>
    );
};

export default CollectionPage;
