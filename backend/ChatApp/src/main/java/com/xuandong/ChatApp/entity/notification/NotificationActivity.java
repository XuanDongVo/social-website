package com.xuandong.ChatApp.entity.notification;

import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.enums.ActionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "notification_activities")
public class NotificationActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "notification_content_id", nullable = false)
    private NotificationContent notificationContent;

    @ManyToOne
    @JoinColumn(name = "actor_id", nullable = false)
    private User actor; // Người thực hiện hành động (VD: người follow)

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType; // FOLLOW, LIKE, COMMENT, etc.


    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt ;

    @PrePersist
    public void onCreated() {
        this.createdAt = LocalDateTime.now();
    }


}
