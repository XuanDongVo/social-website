package com.xuandong.ChatApp.dto.response.notification;

import com.xuandong.ChatApp.dto.response.user.SimpleUserResponse;
import com.xuandong.ChatApp.enums.ActionType;
import com.xuandong.ChatApp.enums.EntityType;
import com.xuandong.ChatApp.enums.NotificationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponse {
    private SimpleUserResponse actor;
    private EntityType entityType;
    private String entityId;
    private ActionType actionType;
    private LocalDateTime createdAt;
    private String urlImage;
    private NotificationStatus status;
}
