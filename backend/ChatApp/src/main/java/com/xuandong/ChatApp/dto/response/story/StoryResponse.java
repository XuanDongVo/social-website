package com.xuandong.ChatApp.dto.response.story;

import java.time.LocalDateTime;
import java.util.List;

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
public class StoryResponse {
	private String id;
	private String urlImage;
	private LocalDateTime createAt;
	private boolean isSeen;
	private List<StoryViewResponse> storyViewers;
	
}
