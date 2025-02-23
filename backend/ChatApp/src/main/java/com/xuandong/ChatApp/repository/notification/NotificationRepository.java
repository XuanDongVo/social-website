package com.xuandong.ChatApp.repository.notification;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Notification;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.User;

public interface NotificationRepository extends JpaRepository<Notification, String> {
	Optional<Notification> findBySenderAndPost(User sender , Post post);
}
