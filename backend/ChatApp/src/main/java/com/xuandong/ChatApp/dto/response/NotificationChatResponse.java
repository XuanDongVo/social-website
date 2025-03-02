package com.xuandong.ChatApp.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.xuandong.ChatApp.enums.MessageType;
import com.xuandong.ChatApp.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationChatResponse {
	private String chatId;
	private String content;
	private String senderId;
	private String receiverId;
	private String chatName;
	private MessageType messageType;
	private NotificationType notificationType;
	private String pathImage;
	private LocalDateTime createdAt;

}