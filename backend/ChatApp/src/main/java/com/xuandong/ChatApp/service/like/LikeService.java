package com.xuandong.ChatApp.service.like;

import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.entity.Like;
import com.xuandong.ChatApp.entity.Notification;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.repository.like.LikeRepository;
import com.xuandong.ChatApp.repository.notification.NotificationRepository;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.utils.NotificationType;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {
	private final LikeRepository likeRepository;
	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final PostRepository postRepository;

	public void updateLike(String postId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Post not found with id " + postId));
		Optional<Like> currentLike = likeRepository.findByUserAndPost(user, post);
		if (currentLike.isPresent()) {
			likeRepository.delete(currentLike.get());
			Notification notification = notificationRepository.findBySenderAndPost(user, post)
					.orElseThrow(() -> new EntityNotFoundException());
			notificationRepository.delete(notification);

			return;
		}

		Like like = new Like();
		like.setUser(user);
		like.setPost(post);
		likeRepository.save(like);

		Notification notification = new Notification();
		notification.setType(NotificationType.LIKE);
		notification.setSender(user);
		notification.setReceiver(post.getUser());
		notification.setPost(post);

		notificationRepository.save(notification);

	}

}
