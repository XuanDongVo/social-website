package com.xuandong.ChatApp.entity;

import java.util.List;

import com.xuandong.ChatApp.utils.MessageType;
import com.xuandong.ChatApp.utils.NotificationType;

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
public class NotificationChat {

	private String chatId;
	private String content;
	private String senderId;
	private String receiverId;
	private String chatName;
	private MessageType messageType;
	private NotificationType type;
	private List<String> urlFiles;

}