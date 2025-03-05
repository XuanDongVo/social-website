package com.xuandong.ChatApp.dto.response;

import java.time.LocalDateTime;
import java.util.List;

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
	public class CommentResponse {
		private String id;
		private String content;
		private UserResponse sender;
		private LocalDateTime createAt;
		private List<CommentResponse> replies;
	}
