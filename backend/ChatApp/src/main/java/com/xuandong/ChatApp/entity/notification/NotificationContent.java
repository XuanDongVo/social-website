package com.xuandong.ChatApp.entity.notification;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.xuandong.ChatApp.enums.EntityType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "notification_contents")
public class NotificationContent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private EntityType entityType; // USER, POST, COMMENT, etc.

    @Column(name = "entity_id", nullable = false)
    private String entityId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt ;

    @OneToMany(mappedBy = "notificationContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotificationActivity> activities = new ArrayList<>();

    @OneToMany(mappedBy = "notificationContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    @PrePersist
    public void onCreated() {
        this.createdAt = LocalDateTime.now();
    }
}

