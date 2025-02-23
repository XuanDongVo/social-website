package com.xuandong.ChatApp.controller.like;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xuandong.ChatApp.service.like.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/like")
@RequiredArgsConstructor
public class LikeController {

	private final LikeService likeService;
	
	@GetMapping("like-post")
	public void likePost(@RequestParam("id") String postId) {
		likeService.updateLike(postId);
	}
}
