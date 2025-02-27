package com.xuandong.ChatApp.dto.request;

import com.xuandong.ChatApp.enums.MessageType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
	private String content;
	private String senderId;
	private String receiverId;
	private MessageType type;
	private String chatId;
}
