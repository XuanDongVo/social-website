package com.xuandong.ChatApp.mapper;

import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.ChatResponse;
import com.xuandong.ChatApp.entity.Chat;

@Service
public class ChatMapper {
	public ChatResponse toChatResponse(Chat chat, String senderId) {
		return ChatResponse.builder().id(chat.getId()).
				name(chat.getChatName(senderId))
				.unReadCount(chat.getUnreadMessages(senderId))
				.lastMessage(chat.getLastMessage())
				.lastMessageTime(chat.getLastMessageTime())
				.isRecipientOnline(chat.getRecipient().isUserOnline())
				.senderId(chat.getSender().getId()).receiverId(chat.getRecipient().getId()).build();
	}
}
