package com.xuandong.ChatApp.repository.notification;

import com.xuandong.ChatApp.entity.notification.NotificationContent;
import com.xuandong.ChatApp.enums.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationContentRepository extends JpaRepository<NotificationContent, String> {
    Optional<NotificationContent> findByEntityTypeAndEntityId(EntityType entityType, String entityId);
    Optional<NotificationContent> findById(String id);
}
