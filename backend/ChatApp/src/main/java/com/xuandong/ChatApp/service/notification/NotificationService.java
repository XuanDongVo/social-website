package com.xuandong.ChatApp.service.notification;

import com.xuandong.ChatApp.dto.response.NotificationChatResponse;
import com.xuandong.ChatApp.dto.response.notification.NotificationResponse;
import com.xuandong.ChatApp.dto.response.user.SimpleUserResponse;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.entity.notification.Notification;
import com.xuandong.ChatApp.entity.notification.NotificationActivity;
import com.xuandong.ChatApp.entity.notification.NotificationContent;
import com.xuandong.ChatApp.enums.NotificationStatus;
import com.xuandong.ChatApp.mapper.UserMapper;
import com.xuandong.ChatApp.repository.notification.NotificationActivityRepository;
import com.xuandong.ChatApp.repository.notification.NotificationContentRepository;
import com.xuandong.ChatApp.repository.notification.NotificationRepository;
import com.xuandong.ChatApp.enums.ActionType;
import com.xuandong.ChatApp.enums.EntityType;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.utils.SseEmitterManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationActivityRepository notificationActivityRepository;
    private final NotificationContentRepository notificationContentRepository;
    private final UserMapper userMapper;
    private final SseEmitterManager sseEmitterManager;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final PostRepository postRepository;


    public void sendMessage(String userId, NotificationChatResponse notification) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/chat",
                notification
        );
    }

    // đánh dấu đã đọc tin nhắn
    public void markAsRead(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        List<Notification> notifications = notificationRepository.findByReceiverOrderByCreatedAtDesc(user).stream()
                .peek(notification -> notification.setStatus(NotificationStatus.READ)).toList();
        notificationRepository.saveAll(notifications);

    }

    // danh sách notifcation của người dùng
    public List<NotificationResponse> getNotifcationOfUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Lấy danh sách thông báo của người dùng
        List<Notification> notifications = notificationRepository.findByReceiverOrderByCreatedAtDesc(user);

        return notifications.stream().map(notification -> {
            NotificationContent content = notification.getNotificationContent();

            // Lấy hoạt động thông báo đầu tiên
            NotificationActivity activity = content.getActivities().isEmpty() ? null : content.getActivities().get(0);
            User actor = (activity != null) ? activity.getActor() : null;

            // Chuyển đổi User thành SimpleUserResponse
            SimpleUserResponse actorResponse = (actor != null)
                    ? new SimpleUserResponse(actor.getId(), actor.getFirstName(), actor.getLastName())
                    : null;

            // Lấy URL hình ảnh nếu entityType là POST
            String imageUrl = null;
            if (content.getEntityType() == EntityType.POST) {
                imageUrl = postRepository.findById(content.getEntityId())
                        .map(post -> post.getPostImages().getFirst().getUrlImage())
                        .orElse(null);
            }

            // Tạo đối tượng NotificationResponse
            return NotificationResponse.builder()
                    .actor(actorResponse)
                    .entityType(content.getEntityType())
                    .entityId(content.getEntityId())
                    .actionType((activity != null) ? activity.getActionType() : null)
                    .createdAt(notification.getCreatedAt())
                    .status(notification.getStatus())
                    .urlImage(imageUrl)
                    .build();
        }).toList();
    }


    // Khởi tạo thông báo
    public boolean createNotification(User actor, User receiver, EntityType entityType, String entityId, ActionType actionType) {
        // 1.  tạo NotificationContent
        NotificationContent notificationContent = new NotificationContent();
        notificationContent.setEntityType(entityType);
        notificationContent.setEntityId(entityId);
        notificationContentRepository.save(notificationContent);

        // 2. Kiểm tra xem NotificationActivity đã tồn tại chưa
        boolean activityExists = notificationActivityRepository.existsByActorAndActionTypeAndNotificationContent(actor, actionType, notificationContent);
        // 3. Kiểm tra xem Notification đã tồn tại chưa
        boolean notificationExists = notificationRepository.existsByReceiverAndNotificationContent(receiver, notificationContent);
        if (notificationExists && activityExists) {
            return false;
        }
        // 4. Tạo NotificationActivity
        NotificationActivity notificationActivity = new NotificationActivity();
        notificationActivity.setActor(actor);
        notificationActivity.setActionType(actionType);
        notificationActivity.setNotificationContent(notificationContent);
        notificationActivityRepository.save(notificationActivity);

        // 5. Tạo Notification
        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setNotificationContent(notificationContent);
        notificationRepository.save(notification);

        return true;
    }

    // xóa thông báo
    public void deleteNotification(User actor, User receiver, EntityType entityType, String entityId, ActionType actionType) {
        NotificationContent notificationContent = notificationContentRepository.findByEntityTypeAndEntityId(entityType, entityId)
                .orElse(null);

        if (notificationContent == null) {
            return;
        }

        NotificationActivity notificationActivity = notificationActivityRepository.findByActorAndActionTypeAndNotificationContent(actor, actionType, notificationContent).orElse(null);
        Notification notification = notificationRepository.findByReceiverAndNotificationContent(receiver, notificationContent).orElse(null);
        if (notification == null && notificationActivity == null) {
            return;
        }

        if (notification != null) {
            notificationRepository.delete(notification);
        }

        if (notificationActivity != null) {
            notificationActivityRepository.delete(notificationActivity);
        }

        // kiem tra xem còn trường nào liên kết nới notificationContext không
        if (notificationContent.getActivities().isEmpty() && notificationContent.getNotifications().isEmpty()) {
            notificationContentRepository.delete(notificationContent);
        }

    }

    // Gửi thông báo khi có người follow
    public boolean createFollowNotification(User actor, User receiver) {
        return createNotification(actor, receiver, EntityType.USER, receiver.getId(), ActionType.FOLLOW);
    }

    // Gửi thông báo khi có người like bài viết
    public boolean createLikePostNotification(User actor, String postId, User receiver) {
        return createNotification(actor, receiver, EntityType.POST, postId, ActionType.LIKE);
    }

    public void sendFollowNotification(User actor, User receiver) {
        // Gửi thông báo follow
        boolean isCreate = createFollowNotification(actor, receiver);

        if (!isCreate) {
            return;
        }
        NotificationResponse responseDTO = NotificationResponse.builder()
                .actor(userMapper.toSimpleUserResponse(actor))
                .entityType(EntityType.USER)
                .entityId(receiver.getId())
                .actionType(ActionType.FOLLOW)
                .createdAt(LocalDateTime.now())
                .status(NotificationStatus.UNREAD)
                .build();

        sseEmitterManager.sendFollowNotification(receiver.getId(), responseDTO);

    }

    public void sendLikePostNotification(User actor, User receiver, Post post) {
        boolean isCreate = createLikePostNotification(actor, post.getId(), receiver);

        if (!isCreate) {
            return;
        }
        NotificationResponse responseDTO = NotificationResponse.builder()
                .actor(userMapper.toSimpleUserResponse(actor))
                .entityType(EntityType.POST)
                .entityId(post.getId())
                .actionType(ActionType.LIKE)
                .urlImage(post.getPostImages().getFirst().getUrlImage())
                .createdAt(LocalDateTime.now())
                .status(NotificationStatus.UNREAD)
                .build();

        sseEmitterManager.sendLikePostNotification(receiver.getId(), responseDTO);


    }

    // Xóa thông báo khi người dùng hủy follow
    public void deleteFollowNotification(User actor, User receiver) {
        deleteNotification(actor, receiver, EntityType.USER, receiver.getId(), ActionType.FOLLOW);
    }

    // Xóa thông báo khi người dùng hủy like bài viết
    public void deleteLikePostNotification(User actor, User receiver, Post post) {
        deleteNotification(actor, receiver, EntityType.POST, post.getId(), ActionType.LIKE);
    }
}