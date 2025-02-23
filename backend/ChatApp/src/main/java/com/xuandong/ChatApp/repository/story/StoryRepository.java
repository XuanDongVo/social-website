package com.xuandong.ChatApp.repository.story;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Story;

public interface StoryRepository extends JpaRepository<Story, String> {
	Optional<Story> findById(String id);
}
