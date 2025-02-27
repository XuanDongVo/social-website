package com.xuandong.ChatApp.controller.post;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.xuandong.ChatApp.dto.request.CreatePostRequest;
import com.xuandong.ChatApp.dto.response.PostResponse;
import com.xuandong.ChatApp.service.post.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostController {
	private final PostService postService;

	@PostMapping("/upload")
	@ResponseStatus(HttpStatus.CREATED)
	public void uploadPost(@RequestBody CreatePostRequest request) {
		try {
			postService.uploadPost(request.getCaption(), request.getImages());
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Lỗi create post");
		}
	}

	@GetMapping("/self-post")
	public ResponseEntity<Page<PostResponse>> getSelfPosts(@RequestParam("id") String userId, @RequestParam("page") int currentPage) {
		return ResponseEntity.ok(postService.getSelfPosts(userId,currentPage - 1));
	}
	
	@GetMapping("news-feed")
	public  ResponseEntity<List<PostResponse>> getUserFeed(@RequestParam("page") int curentPage){
		return ResponseEntity.ok(postService.getUserFeed(curentPage));
	}
	
	@DeleteMapping("/delete")
	public void deletePost(@RequestParam("id") String postId) {
		try {
			postService.deletePost(postId);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Lỗi");
		}
	}

	@GetMapping
	public PostResponse getPostById (@RequestParam("id") String postId ) {
		return postService.findById(postId);
	}

}
