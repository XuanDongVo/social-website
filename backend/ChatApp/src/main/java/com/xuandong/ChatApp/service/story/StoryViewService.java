package com.xuandong.ChatApp.service.story;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.entity.Story;
import com.xuandong.ChatApp.entity.StoryView;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.repository.story.StoryRepository;
import com.xuandong.ChatApp.repository.story.StoryViewRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoryViewService {
	private final StoryViewRepository storyViewRepository;
	private final StoryRepository storyRepository;
	private final UserRepository userRepository;

	@Transactional
	public void seenStoryAndLike(String storyId, Authentication authentication, boolean isLike) {
		User user = userRepository.findByEmail(authentication.getName()).orElseThrow(
				() -> new EntityNotFoundException("User not found with email:" + authentication.getName()));
		Story story = storyRepository.findById(storyId)
				.orElseThrow(() -> new EntityNotFoundException("Story not found with id:" + storyId));

		// kiem tra user co phai la nguoi so huu khong
		if (story.getOwner().equals(user)) {
			return;
		}

		StoryView storyView = storyViewRepository.findByStoryAndViewer(story, user).orElse(new StoryView());
		storyView.setStory(story);
		storyView.setViewer(user);
		storyView.setLike(true);
		storyViewRepository.save(storyView);
	}

}
