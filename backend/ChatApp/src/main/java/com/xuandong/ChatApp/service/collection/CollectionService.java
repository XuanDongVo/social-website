package com.xuandong.ChatApp.service.collection;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import com.xuandong.ChatApp.dto.response.collection.CollectionResponse;
import com.xuandong.ChatApp.dto.response.collection.PreviewCollectionImageResponse;
import com.xuandong.ChatApp.entity.*;
import com.xuandong.ChatApp.mapper.CollectionMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.repository.collection.CollectionDetailRepository;
import com.xuandong.ChatApp.repository.collection.CollectionRepository;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.savedPost.SavedPostDetailRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.savedPost.SavedPostService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final SavedPostService savedPostService;
    private final UserRepository userRepository;
    private final CollectionRepository collectionRepository;
    private final SavedPostDetailRepository savedPostDetailRepository;
    private final PostRepository postRepository;
    private final CollectionDetailRepository collectionDetailRepository;
    private final CollectionMapper collectionMapper;


    public List<PreviewCollectionImageResponse> getPreviewCollections() {
        SavedPost savedPost = savedPostService.getUserSavedPost();
        Pageable pageable = PageRequest.of(0, 4);

        Page<Collection> collections = collectionRepository.findBySavedPost(savedPost, pageable);
        if (collections.isEmpty()) {
            return Collections.emptyList();
        }

        return collections.stream()
                .map(collection -> PreviewCollectionImageResponse.builder()
                        .collectionId(collection.getId())
                        .name(collection.getName())
                        .images(collection.getCollectionDetails().stream()
                                .map(collectionDetail -> {
                                    List<PostImages> postImages = collectionDetail.getSavedPostDetail().getPost().getPostImages();
                                    return postImages.isEmpty() ? null : postImages.getFirst().getUrlImage();
                                })
                                .filter(Objects::nonNull)
                                .toList()
                        )
                        .build()
                )
                .toList();
    }


    public CollectionResponse getCollectionById(String collectionId , int currentPage){
        Pageable pageable = PageRequest.of(currentPage, 12);

        Collection collection = collectionRepository.findById(collectionId).orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));

        Page<CollectionDetail> collectionDetails = collectionDetailRepository.findByCollection(collection, pageable);

        if (collectionDetails.isEmpty()) {
            return null;
        }

        return collectionMapper.toCollectionResponse(collection,collectionDetails.getContent(), collection.getSavedPost().getUser());
    }


    @Transactional
    public void createCollection(List<String> savedPostDetails, String collectionName) {
        SavedPost savedPost = savedPostService.getUserSavedPost();

        if (savedPost == null) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new EntityNotFoundException("User not found by email: " + email));
            savedPost = savedPostService.createSavedPost(user);
        }

        final SavedPost finalSavedPost = savedPost;

        Collection collection = new Collection();
        collection.setSavedPost(finalSavedPost);
        collection.setName(collectionName);

        collectionRepository.save(collection);

        if (!savedPostDetails.isEmpty()) {
            savedPostDetails.forEach(savePostDetail -> {
                CollectionDetail collectionDetail = new CollectionDetail();
                collectionDetail.setCollection(collection);

                Post post = postRepository.findById(savePostDetail)
                        .orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + savePostDetail));

                SavedPostDetail detail = savedPostDetailRepository.findBySavedPostAndPost(finalSavedPost, post)
                        .orElseThrow(() -> new EntityNotFoundException("SavedPostDetail not found"));

                collectionDetail.setSavedPostDetail(detail);

                collectionDetailRepository.save(collectionDetail);
            });
        }
    }

    public void modifyCollectionName(String collectionId, String collectionName) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));
        collection.setName(collectionName);
        collectionRepository.save(collection);
    }

    @Transactional
    public void addSavedPostInCollection(String collectionId, List<String> savedPostDetails) {
        SavedPost savedPost = savedPostService.getUserSavedPost();

        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));

        savedPostDetails.forEach(savePostDetail -> {
            Post post = postRepository.findById(savePostDetail)
                    .orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + savePostDetail));

            SavedPostDetail detail = savedPostDetailRepository.findBySavedPostAndPost(savedPost, post)
                    .orElseThrow(() -> new EntityNotFoundException("SavedPostDetail not found"));

            // Kiểm tra xem collectionDetail đã tồn tại chưa
            boolean exists = collectionDetailRepository.existsByCollectionAndSavedPostDetail(collection, detail);
            if (!exists) {
                CollectionDetail collectionDetail = new CollectionDetail();
                collectionDetail.setCollection(collection);
                collectionDetail.setSavedPostDetail(detail);

                collectionDetailRepository.save(collectionDetail);
            }
        });
    }

    @Transactional
    public void deleteSavedPostInCollection(String collectionId, String postId) {
        SavedPost savedPost = savedPostService.getUserSavedPost();

        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + postId));

        SavedPostDetail detail = savedPostDetailRepository.findBySavedPostAndPost(savedPost, post)
                .orElseThrow(() -> new EntityNotFoundException("SavedPostDetail not found"));

        CollectionDetail collectionDetail = collectionDetailRepository
                .findByCollectionAndSavedPostDetail(collection, detail)
                .orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));

        collectionDetailRepository.delete(collectionDetail);

    }

    @Transactional
    public void deleteColletion(String collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));
        collectionRepository.delete(collection);
    }
}
