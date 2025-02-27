package com.xuandong.ChatApp.controller.savedPost;

import com.xuandong.ChatApp.dto.response.savedPost.PreviewSavedPostImageResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.xuandong.ChatApp.dto.response.PostResponse;
import com.xuandong.ChatApp.service.savedPost.SavedPostService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/v1/saved-post")
@RequiredArgsConstructor
public class SavedPostController {
    private final SavedPostService savedPostService;

    @GetMapping("/preview")
    public PreviewSavedPostImageResponse getPreviewSavedPost() {
        return savedPostService.getPreviewSavedPost();
    }

    @GetMapping("/all")
    public Page<PostResponse> getSavedPost(@RequestParam("page") int currentPage) {
        return savedPostService.getSavedPost(currentPage);
    }

    @PostMapping("/save")
    public void savePost(@RequestParam("id") String postId) {
        try {
            savedPostService.savePost(postId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "error");
        }
    }

    @DeleteMapping("/delete")
    public void deletesavedPost(@RequestParam("id") String postId) {
        try {
            savedPostService.deleteSavedPost(postId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "error");
        }
    }
}
