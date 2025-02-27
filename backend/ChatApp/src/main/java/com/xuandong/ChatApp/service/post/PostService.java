package com.xuandong.ChatApp.service.post;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.PostResponse;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.PostImages;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.mapper.PostMapper;
import com.xuandong.ChatApp.repository.post.PostImagesRepository;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.file.FileService;
import com.xuandong.ChatApp.service.redis.RedisService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
	private final PostRepository postRepository;
	private final PostImagesRepository postImagesRepository;
	private final FileService fileService;
	private final PostMapper postMapper;
	private final UserRepository userRepository;
	private final RedisService redisService;

	// lấy post của bản thân
	public Page<PostResponse> getSelfPosts(String userId, int currentPage) {
		Pageable pageable = PageRequest.of(currentPage, 12);
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("Not found user with id: " + userId));
		return postRepository.getSelfPosts(userId, pageable).map(post -> postMapper.postMapper(post, user));
	}

	public PostResponse findById(String postId ) {
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Not found post by id: " + postId));
		return postMapper.postMapper(post, post.getUser());
	}
	
	// newfeed của following
	public List<PostResponse> getUserFeed(int page) {
	    String email = SecurityContextHolder.getContext().getAuthentication().getName();
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new EntityNotFoundException("User not found"));

	    List<String> postIds = redisService.getNewsfeed(user.getId(), page);

	    if (postIds.isEmpty()) {
	        return Collections.emptyList(); 
	    }

	    List<Post> posts = postRepository.findAllById(postIds);

	    return posts.stream()
	            .map(post -> postMapper.postMapper(post, user))
	            .collect(Collectors.toList());
	}
	
	// đánh dấu đã xem và xóa trong redis
	public void markPostAsSeen(String postId) {
		 String email = SecurityContextHolder.getContext().getAuthentication().getName();
		    User user = userRepository.findByEmail(email)
		            .orElseThrow(() -> new EntityNotFoundException("User not found"));
		    redisService.removePostFromFeed(user.getId(), postId);
	}

	

	@Transactional
	// đăng post
	public void uploadPost(String content, List<String> urlImages) {
		String authentication = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(authentication)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		Post post = new Post();
		post.setContent(content);
		post.setUser(user);
		postRepository.save(post);

		urlImages.forEach(url -> {
			PostImages postImages = new PostImages();
			postImages.setPost(post);
			postImages.setUrlImage(url);
			postImagesRepository.save(postImages);
		});
		
		redisService.pushPostToFollowers( user,post.getId());

	}

	@Transactional
	// xóa post
	public void deletePost(String postId) {
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Post not found by id: " + postId));
		post.getPostImages().forEach(postImage -> {
			try {
				fileService.deleteImageInCloudinary(postImage.getUrlImage());
			} catch (IOException e) {
				e.printStackTrace();
			}
		});
		postRepository.delete(post);
	}



}
