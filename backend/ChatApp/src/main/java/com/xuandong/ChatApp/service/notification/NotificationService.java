package com.xuandong.ChatApp.service.notification;

import java.util.HashMap;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.PostResponse;
import com.xuandong.ChatApp.dto.response.user.UserResponse;
import com.xuandong.ChatApp.entity.Like;
import com.xuandong.ChatApp.entity.NotificationChat;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.repository.notification.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	private final NotificationRepository notificationRepository;
	private final SimpMessagingTemplate messagingTemplate;
	

	public void sendNotification(String userId, NotificationChat notification) {
		messagingTemplate.convertAndSendToUser(userId, "/chat", notification);
	}

	public void sendNotificationLike(User user, PostResponse postResponse, String like) {
		// Tạo Map để chứa thông tin
		Map<String, Object> notification = new HashMap<>();
		notification.put("postResponse", postResponse);
		notification.put("user", user);
		notification.put("like", like);

		messagingTemplate.convertAndSendToUser(user.getId(), "/like", notification);
	}

	public void sendNoficationFollow(String userId, UserResponse user) {
		messagingTemplate.convertAndSendToUser(userId, "/follow", user);
	}
}