package com.xuandong.ChatApp.dto.response.user;

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
public class ProfileResponse {
	private UserResponse user;
	private int followingCount;
	private int followerCount;
	private int postCount;
}
