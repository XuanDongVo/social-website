package com.xuandong.ChatApp.dto.response;

import java.util.List;

import com.xuandong.ChatApp.dto.response.user.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {
	private String postId;
	private UserResponse user;
	private String caption;
	private boolean isSelfLike;
	private boolean isSavedPost;
	private List<String> images;
	private int countLikes;
	private int countComments;
	private List<UserResponse> listUsersLike;

}
