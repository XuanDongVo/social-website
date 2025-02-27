package com.xuandong.ChatApp.controller.colllection;

import com.xuandong.ChatApp.dto.request.CollectionRequest;
import com.xuandong.ChatApp.dto.response.collection.CollectionResponse;
import com.xuandong.ChatApp.dto.response.collection.PreviewCollectionImageResponse;
import com.xuandong.ChatApp.service.collection.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/collection")
public class CollectionController {
    private final CollectionService collectionService;

    @GetMapping("/preview")
    public List<PreviewCollectionImageResponse> getPreviewCollections() {
        return collectionService.getPreviewCollections();
    }

    @GetMapping("/{id}")
    public CollectionResponse getCollectionById(@PathVariable("id") String collectionId, @RequestParam("page") int currentPage) {
        return collectionService.getCollectionById(collectionId, currentPage);
    }

    @PostMapping("/create")
    public void createCollection(@RequestBody CollectionRequest collectionRequest) {
        collectionService.createCollection(collectionRequest.getPostIds(), collectionRequest.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteCollection(@PathVariable("id") String collectionId) {
        try {
            collectionService.deleteColletion(collectionId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error!");
        }
    }

    @DeleteMapping("/delete/saved-post")
    public void deleteSavedPostInCollection(@RequestParam String collectionId, @RequestParam String postId){
        try {
            collectionService.deleteSavedPostInCollection(collectionId, postId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error!");
        }
    }

    @PutMapping("/modify/name")
    public void modifyCollectionName(@RequestParam String collectionId, @RequestParam("collectionName") String newName){
        try {
            collectionService.modifyCollectionName(collectionId, newName);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error!");
        }
    }

    @PostMapping("/add/saved-post")
    public void addSavedPostInCollection(@RequestBody CollectionRequest collectionRequest){
        try {
            collectionService.addSavedPostInCollection(collectionRequest.getCollectionId(), collectionRequest.getPostIds());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error!");
        }
    }


}
