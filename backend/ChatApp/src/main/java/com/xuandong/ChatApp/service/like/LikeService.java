package com.xuandong.ChatApp.service.like;

import com.xuandong.ChatApp.dto.response.FollowResponse;
import com.xuandong.ChatApp.entity.Like;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.mapper.UserMapper;
import com.xuandong.ChatApp.repository.follow.FollowRepository;
import com.xuandong.ChatApp.repository.like.LikeRepository;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.notification.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {
	private final LikeRepository likeRepository;
	private final NotificationService notificationService;
	private final UserRepository userRepository;
	private final PostRepository postRepository;
	private final UserMapper userMapper;
	private final FollowRepository followRepository;

	public boolean toggleLike(String postId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Post not found with id " + postId));
		Optional<Like> currentLike = likeRepository.findByUserAndPost(user, post);

		if (currentLike.isPresent()) {
			likeRepository.delete(currentLike.get());
			return false;
		} else {
			Like like = new Like();
			like.setUser(user);
			like.setPost(post);
			likeRepository.save(like);
			notificationService.sendLikePostNotification(user, post.getUser(), post);
			return true;
		}
	}

	public List<FollowResponse> getLikesPost(String postId) {
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Post not found with id " + postId));
		List<Like> likes = likeRepository.findByPost(post);
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User self = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));

		if (likes.isEmpty()) {
			return new ArrayList<>();
		}
		return  likes.stream().map(like ->
				FollowResponse.builder()
						.follow(userMapper.toUserResponse(like.getUser()))
						.isFollowingBack(followRepository.existsByUserAndUserFollowing( self, like.getUser()))
						.build())
				.toList();
	}

}
