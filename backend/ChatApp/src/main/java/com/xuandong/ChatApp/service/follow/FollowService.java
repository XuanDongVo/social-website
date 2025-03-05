package com.xuandong.ChatApp.service.follow;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.xuandong.ChatApp.service.notification.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.FollowResponse;
import com.xuandong.ChatApp.entity.Follow;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.mapper.UserMapper;
import com.xuandong.ChatApp.repository.follow.FollowRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FollowService {

	private final FollowRepository followRepository;
	private final UserMapper userMapper;
	private final UserRepository userRepository;
	private final NotificationService notificationService;


	// danh sách follow của user
	public List<FollowResponse> getFollowing() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));


		List<FollowResponse> followResponses = new ArrayList<>();

		followRepository.findFollowingByUser(user.getId()).forEach(follow -> {
			FollowResponse followResponse = FollowResponse.builder().followId(follow.getId())
					.follow(userMapper.toUserResponse(follow.getUserFollowing())).build();

			followResponses.add(followResponse);
		});

		return followResponses;
	}


	// danh sách người dùng follow user
	public List<FollowResponse> getFollower(User user) {
		List<FollowResponse> followResponses = new ArrayList<>();

		followRepository.findFollowers(user.getId()).forEach(follow -> {
			FollowResponse followResponse = FollowResponse.builder().followId(follow.getId())
					.follow(userMapper.toUserResponse(follow.getUser()))
					.isFollowingBack(followRepository.existsByUserAndUserFollowing(user, follow.getUser()))
					.build();

			followResponses.add(followResponse);
		});

		return followResponses;
	}

	// kiem tra da following chua
	public boolean isFollowing(String userId) {
		 String email = SecurityContextHolder.getContext().getAuthentication().getName();
		    User self = userRepository.findByEmail(email)
		        .orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));

		    return self.getFollows().stream()
		        .anyMatch(following -> following.getUserFollowing().getId().equals(userId));
	}
	
	public boolean handleFollow(String userId) {
	    String email = SecurityContextHolder.getContext().getAuthentication().getName();
	    User self = userRepository.findByEmail(email)
	            .orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));

	    User userToFollow = userRepository.findById(userId)
	            .orElseThrow(() -> new EntityNotFoundException("User not found with id " + userId));

	    Optional<Follow> existingFollow = followRepository.findByUserAndUserFollowing(self, userToFollow);

	    if (existingFollow.isPresent()) {
	        // Nếu đã follow, thì unfollow
	        followRepository.delete(existingFollow.get());
			notificationService.deleteFollowNotification(self,userToFollow);
	        return false;
	    } else {
	        // Nếu chưa follow, thì tạo mới
	        Follow follow = new Follow();
	        follow.setUser(self);
	        follow.setUserFollowing(userToFollow);
	        followRepository.save(follow);
			notificationService.sendFollowNotification(self,userToFollow);

	        return true;
	    }
	}

	public void deleteFollower(String userId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User self = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found with id " + userId));
		Follow follow = followRepository.findByUserAndUserFollowing(user, self).orElseThrow();
		followRepository.delete(follow);
	}

}
