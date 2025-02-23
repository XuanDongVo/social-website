package com.xuandong.ChatApp.mapper;

import java.util.Collections;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.story.StoryResponse;
import com.xuandong.ChatApp.entity.Story;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoryMapper {

	private final StoryViewMapper storyViewMapper;

	public StoryResponse toStoryResponse(Story story, String currentUserId) {
		return StoryResponse.builder().id(story.getId()).urlImage(story.getUrlImage()).createAt(story.getCreateAt())
				.isSeen(story.checkIsSeen(currentUserId)).storyViewers(Optional.ofNullable(story.getStoryViews())
						.orElse(Collections.emptyList()).stream().map(storyViewMapper::toStoryViewMapper).toList())
				.build();
	}
}
