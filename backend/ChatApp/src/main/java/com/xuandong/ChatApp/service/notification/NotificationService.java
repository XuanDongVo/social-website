package com.xuandong.ChatApp.service.notification;

import com.xuandong.ChatApp.dto.response.notification.NotificationFollowResponse;
import com.xuandong.ChatApp.dto.response.notification.NotificationLikePostResponse;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.entity.notification.Notification;
import com.xuandong.ChatApp.entity.notification.NotificationActivity;
import com.xuandong.ChatApp.entity.notification.NotificationContent;
import com.xuandong.ChatApp.mapper.UserMapper;
import com.xuandong.ChatApp.repository.notification.NotificationActivityRepository;
import com.xuandong.ChatApp.repository.notification.NotificationContentRepository;
import com.xuandong.ChatApp.repository.notification.NotificationRepository;
import com.xuandong.ChatApp.enums.ActionType;
import com.xuandong.ChatApp.enums.EntityType;
import com.xuandong.ChatApp.utils.SseEmitterManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {
	private final NotificationRepository notificationRepository;
	private final NotificationActivityRepository notificationActivityRepository;
	private final NotificationContentRepository notificationContentRepository;
	private final UserMapper userMapper;
	private final SseEmitterManager sseEmitterManager;

	public void createNotification(User actor, User receiver, EntityType entityType, String entityId, ActionType actionType) {
		// 1. Kiểm tra và lấy hoặc tạo NotificationContent
		NotificationContent notificationContent = notificationContentRepository.findByEntityTypeAndEntityId(entityType, entityId)
				.orElseGet(() -> {
					NotificationContent newContent = new NotificationContent();
					newContent.setEntityType(entityType);
					newContent.setEntityId(entityId);
					return notificationContentRepository.save(newContent); // Lưu nếu chưa tồn tại
				});

		// 2. Tạo NotificationActivity (người gửi hành động)
		NotificationActivity notificationActivity = new NotificationActivity();
		notificationActivity.setActor(actor);
		notificationActivity.setActionType(actionType);
		notificationActivity.setNotificationContent(notificationContent);
		notificationActivityRepository.save(notificationActivity);

		// 3. Tạo Notification (người nhận)
		Notification notification = new Notification();
		notification.setReceiver(receiver);
		notification.setNotificationContent(notificationContent);
		notificationRepository.save(notification);
	}

	// Gửi thông báo khi có người follow
	public void createFollowNotification(User actor, User receiver) {
		createNotification(actor, receiver, EntityType.USER, receiver.getId(), ActionType.FOLLOW);
	}

	// Gửi thông báo khi có người like bài viết
	public void createLikePostNotification(User actor, String postId, User receiver) {
		createNotification(actor, receiver, EntityType.POST, postId, ActionType.LIKE);
	}

	public void sendFollowNotification(User actor, User receiver) {
		// Gửi thông báo follow
		createFollowNotification(actor, receiver);

		// Tạo DTO để trả về
		NotificationFollowResponse responseDTO = NotificationFollowResponse.builder()
				.actor(userMapper.toSimpleUserResponse(actor)) // Chuyển User thành DTO
				.entityType(EntityType.USER)
				.entityId(receiver.getId())
				.actionType(ActionType.FOLLOW)
				.createdAt(LocalDateTime.now())
				.build();

		sseEmitterManager.sendFollowNotification(receiver.getId(), responseDTO);

	}

	public void sendLikePostNotification(User actor, User receiver , Post post) {
		createLikePostNotification(actor, post.getId(), receiver);

		NotificationLikePostResponse notificationLikePostResponse = NotificationLikePostResponse.builder()
				.actor(userMapper.toSimpleUserResponse(actor))
				.entityType(EntityType.POST)
				.entityId(post.getId())
				.actionType(ActionType.LIKE)
				.urlImage(post.getPostImages().getFirst().getUrlImage())
				.createdAt(LocalDateTime.now())
				.build();

		sseEmitterManager.sendLikePostNotification(receiver.getId(), notificationLikePostResponse);


	}











}