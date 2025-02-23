package com.xuandong.ChatApp.dto.response;

import java.time.LocalDateTime;

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
public class ChatResponse {
	private String id;
	private String name ;
	private long unReadCount;
	private String lastMessage;
	private LocalDateTime lastMessageTime;
	private boolean isRecipientOnline;
	private String senderId;
	private String receiverId;
	
}
