package com.xuandong.ChatApp.controller.follow;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xuandong.ChatApp.dto.response.FollowResponse;
import com.xuandong.ChatApp.service.follow.FollowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/follow")
@RequiredArgsConstructor
public class FollowController {

	private final FollowService followService;

	@GetMapping("/check-follow")
	public boolean checkFollowing(@RequestParam("id") String userId) {
		return followService.isFollowing(userId);
	}

	@PostMapping("/follow")
	public boolean follow(@RequestParam("id") String userId) {
		return followService.handleFollow(userId);
	}
}
