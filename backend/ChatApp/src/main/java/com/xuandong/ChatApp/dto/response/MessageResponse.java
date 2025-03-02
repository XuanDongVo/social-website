package com.xuandong.ChatApp.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.xuandong.ChatApp.enums.MessageState;
import com.xuandong.ChatApp.enums.MessageType;

import com.xuandong.ChatApp.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
	private Long id;
	private String content;
	private MessageType type;
	private MessageState state;
	private String senderId;
	private String receiverId;
	private LocalDateTime createdAt;
	private byte[] media;
}

