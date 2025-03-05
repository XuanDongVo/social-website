package com.xuandong.ChatApp.repository.notification;

import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.entity.notification.Notification;
import com.xuandong.ChatApp.entity.notification.NotificationContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository  extends JpaRepository<Notification,String> {

    boolean existsByReceiverAndNotificationContent(User receiver, NotificationContent notificationContent);

    Optional<Notification> findByReceiverAndNotificationContent(User receiver, NotificationContent notificationContent);

    List<Notification> findByReceiverOrderByCreatedAtDesc(User receiver);
}
