package com.xuandong.ChatApp.repository.notification;

import com.xuandong.ChatApp.entity.notification.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationRepository  extends JpaRepository<Notification,String> {

}
