package com.xuandong.ChatApp.dto.response;

import com.xuandong.ChatApp.dto.response.user.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FollowResponse {
	private String followId;
	private UserResponse follow;
	private boolean isFollowingBack;
}
