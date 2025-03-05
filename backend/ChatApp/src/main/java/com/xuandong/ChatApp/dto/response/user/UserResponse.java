package com.xuandong.ChatApp.dto.response.user;

import java.time.LocalDateTime;
import java.util.List;

import com.xuandong.ChatApp.dto.response.story.StoryResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
	private String id;
	private String firstName;
	private String lastName;
	private String email;
	private String profilePicture;
	private String bio;
	private LocalDateTime lastSeen;
	private boolean isOnline;
	private List<StoryResponse> stories;

}