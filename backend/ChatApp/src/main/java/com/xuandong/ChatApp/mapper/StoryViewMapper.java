package com.xuandong.ChatApp.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.story.StoryViewResponse;
import com.xuandong.ChatApp.entity.StoryView;

import lombok.RequiredArgsConstructor;

@Service
public class StoryViewMapper {
	private UserMapper userMapper;

	@Autowired
	public void setUserMapper(@Lazy UserMapper userMapper) {
		this.userMapper = userMapper;
	}

	public StoryViewResponse toStoryViewMapper(StoryView storyView) {
		return StoryViewResponse.builder().id(storyView.getId()).isLike(storyView.isLike())
				.viewer(userMapper.toUserResponse(storyView.getViewer())).build();
	}

}
