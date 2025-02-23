package com.xuandong.ChatApp.service.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.config.RuntimeBeanNameReference;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xuandong.ChatApp.dto.response.ChatResponse;
import com.xuandong.ChatApp.entity.Chat;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.mapper.ChatMapper;
import com.xuandong.ChatApp.repository.chat.ChatRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
	private final ChatRepository chatRepository;
	private final ChatMapper mapper;
	private final UserRepository userRepository;

	public List<ChatResponse> getChatsByReceiver(String senderId) {
		return chatRepository.findChatsBySenderId(senderId).stream().map(c -> mapper.toChatResponse(c, senderId))
				.toList();
	}

	@Transactional
	public String createChat(String senderId, String receiverId) {
		User sender = userRepository.findById(senderId).orElseThrow(() -> new EntityNotFoundException());
		User recipient = userRepository.findById(receiverId).orElseThrow(() -> new EntityNotFoundException());

		Optional<Chat> existChat = chatRepository.findChatBySenderAndRecipient(sender, recipient);
		if (existChat.isPresent()) {
			return existChat.get().getId();
		}

		Chat chat = new Chat();
		chat.setSender(sender);
		chat.setRecipient(recipient);

		return chatRepository.save(chat).getId();

	}

	public ChatResponse findById(String chatId) {
		Optional<Chat> existChat = chatRepository.findById(chatId);
		if (existChat.isPresent()) {
			return existChat.stream().map(c -> mapper.toChatResponse(c, c.getSender().getId())).findFirst().get();
		}
		return null;
	}

}
