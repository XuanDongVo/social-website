package com.xuandong.ChatApp.controller.like;

import com.xuandong.ChatApp.dto.response.FollowResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xuandong.ChatApp.service.like.LikeService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/v1/like")
@RequiredArgsConstructor
public class LikeController {

	private final LikeService likeService;

	@GetMapping("/like-post/toggle")
	public boolean likePost(@RequestParam("id") String postId) {
		return likeService.toggleLike(postId);
	}

	@GetMapping("/like-post/list")
	public List<FollowResponse> getLikes(@RequestParam("id") String postId) {
		return likeService.getLikesPost(postId);
	}
}
