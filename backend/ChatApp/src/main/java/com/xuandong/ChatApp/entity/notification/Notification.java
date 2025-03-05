package com.xuandong.ChatApp.entity.notification;

import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "notification_content_id", nullable = false)
    private NotificationContent notificationContent;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver; // Người nhận thông báo

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private NotificationStatus status = NotificationStatus.UNREAD; // UNREAD, READ

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt ;
    @PrePersist
    public void onCreated() {
        this.createdAt = LocalDateTime.now();
    }

}

