package com.xuandong.ChatApp.mapper;

import java.util.Collections;
import java.util.Optional;

import com.xuandong.ChatApp.dto.response.user.SimpleUserResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.user.AuthResponse;
import com.xuandong.ChatApp.dto.response.user.ProfileResponse;
import com.xuandong.ChatApp.dto.response.user.UserResponse;
import com.xuandong.ChatApp.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserMapper {
	private final StoryMapper storyMapper;

	public UserResponse toUserResponse(User user) {

		String currentUser = getCurrentUser();

		return UserResponse.builder().id(user.getId()).firstName(user.getFirstName()).lastName(user.getLastName())
				.email(user.getEmail()).lastSeen(user.getLastSeen()).isOnline(user.isUserOnline())
				.stories(Optional.ofNullable(user.getStories()).orElse(Collections.emptyList()).stream()
						.map(story -> storyMapper.toStoryResponse(story, currentUser)).toList())
				.build();
	}

	// Lấy userId từ Spring Security
	private String getCurrentUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof UserDetails userDetails) {
			return userDetails.getUsername();
		}
		return null;
	}

	public AuthResponse toAuthResponse(User user, String accessToken) {
		return AuthResponse.builder().id(user.getId()).name(user.getFirstName() +" "+ user.getLastName())
				.email(user.getEmail()).accessToken(accessToken).build();
	}
	
	public ProfileResponse toProFileUserResponse(User user, int countFollower) {
		return ProfileResponse.builder()
				.user(toUserResponse(user))
				.followingCount(user.getFollows().size())
				.followerCount(countFollower)
				.postCount(user.getPosts().size()).build();
	}

	public SimpleUserResponse toSimpleUserResponse(User user) {
		return SimpleUserResponse.builder().id(user.getId()).firstName(user.getFirstName()).lastName(user.getLastName()).build();
	}
}
