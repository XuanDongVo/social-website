package com.xuandong.ChatApp.repository.story;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Story;
import com.xuandong.ChatApp.entity.StoryView;
import com.xuandong.ChatApp.entity.User;

public interface StoryViewRepository extends JpaRepository<StoryView, String> {
	Optional<StoryView> findByStoryAndViewer(Story story, User viewer);
}
