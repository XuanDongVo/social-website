package com.xuandong.ChatApp.repository.notification;

import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.entity.notification.NotificationActivity;
import com.xuandong.ChatApp.entity.notification.NotificationContent;
import com.xuandong.ChatApp.enums.ActionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationActivityRepository extends JpaRepository<NotificationActivity,String> {

    boolean existsByActorAndActionTypeAndNotificationContent(User actor, ActionType actionType, NotificationContent notificationContent);

    Optional<NotificationActivity> findByActorAndActionTypeAndNotificationContent(User actor, ActionType actionType, NotificationContent notificationContent);
}
