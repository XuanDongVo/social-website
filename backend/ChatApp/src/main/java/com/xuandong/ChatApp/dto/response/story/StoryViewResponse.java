package com.xuandong.ChatApp.dto.response.story;

import com.xuandong.ChatApp.dto.response.user.UserResponse;

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
public class StoryViewResponse {
	private String id;
	private UserResponse viewer;
	private boolean isLike;
}