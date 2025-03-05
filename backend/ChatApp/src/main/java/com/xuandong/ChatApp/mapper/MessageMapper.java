package com.xuandong.ChatApp.mapper;

import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.MessageResponse;
import com.xuandong.ChatApp.entity.Message;

import java.util.Optional;

@Service
public class MessageMapper {
    public MessageResponse toMessageResponse(Message message) {
        String urlImage = Optional.ofNullable(message.getMediaFiles())
                .filter(files -> !files.isEmpty())
                .map(files -> files.getFirst().getFilePath())
                .orElse(null);

        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .type(message.getType())
                .state(message.getState())
                .createdAt(message.getCreatedDate())
                .urlImage(urlImage)
                .build();
    }
}
