package com.xuandong.ChatApp.mapper;

import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.MessageResponse;
import com.xuandong.ChatApp.entity.Message;

@Service
public class MessageMapper {
	public MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .type(message.getType())
                .state(message.getState())
                .createdAt(message.getCreatedDate())
                .media(null)
                .build();
    }
}
