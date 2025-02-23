package com.xuandong.ChatApp.controller.savedPost;

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
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.service.savedPost.SavedPostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/saved-post")
@RequiredArgsConstructor
public class SavedPostController {
	private final SavedPostService savedPostService;

	@GetMapping("/all")
	public Page<PostResponse> getSavedPosts(@RequestParam("page") int currentPage) {
		return savedPostService.getSavedPosts(currentPage);
	}

	@PostMapping("/save")
	public void savePost(@RequestParam("id") String postId) {
		try {
			savedPostService.savePost(postId);
		} catch (Exception e) {
			new ResponseStatusException(HttpStatus.CONFLICT, "error");
		}
	}

	@DeleteMapping("/delete")
	public void deletesavedPost(@RequestParam("id") String postId) {
		try {
			savedPostService.deleteSavedPost(postId);
		} catch (Exception e) {
			new ResponseStatusException(HttpStatus.CONFLICT, "error");
		}
	}
}
