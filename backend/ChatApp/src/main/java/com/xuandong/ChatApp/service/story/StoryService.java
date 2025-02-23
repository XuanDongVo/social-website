package com.xuandong.ChatApp.service.story;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.xuandong.ChatApp.entity.Story;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.repository.story.StoryRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.file.FileService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoryService {
	private final StoryRepository storyRepository;
	private final FileService fileService;
	private final UserRepository userRepository;

	@Transactional
	public void addStory(MultipartFile file, Authentication authentication) throws IOException {
		String urlFile = fileService.uploadImageToCloudinary(file);
		User user = userRepository.findByEmail(authentication.getName()).get();
		Story story = new Story();
		story.setUrlImage(urlFile);
		story.setOwner(user);
		storyRepository.save(story);

	}

	public void deleteStory(String storyId) {
		Story story = storyRepository.findById(storyId)
				.orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + storyId));
		storyRepository.delete(story);
	}

}
