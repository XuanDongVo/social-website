package com.xuandong.ChatApp.service.chat;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
		User sender = userRepository.findById(senderId)
				.orElseThrow(() -> new EntityNotFoundException("Sender not found with ID: " + senderId));
		User recipient = userRepository.findById(receiverId)
				.orElseThrow(() -> new EntityNotFoundException("Receiver not found with ID: " + receiverId));

		// Kiểm tra chat hiện tại (sender -> recipient) hoặc ngược lại (recipient -> sender)
		Optional<Chat> existingChat = chatRepository.findUniqueChatByUsers(senderId, receiverId);
		if (existingChat.isPresent()) {
			return existingChat.get().getId();
		}

		// Nếu không có, tạo chat mới
		Chat chat = new Chat();
		chat.setSender(sender);
		chat.setRecipient(recipient);
		chat.setChatKey(generateChatKey(senderId, receiverId)); // Gán chatKey

		return chatRepository.save(chat).getId();
	}

	private String generateChatKey(String user1Id, String user2Id) {
		return Stream.of(user1Id, user2Id)
				.sorted()
				.collect(Collectors.joining("_"));
	}

	public ChatResponse findById(String chatId) {
		Optional<Chat> existChat = chatRepository.findById(chatId);
		if (existChat.isPresent()) {
			return existChat.stream().map(c -> mapper.toChatResponse(c, c.getSender().getId())).findFirst().get();
		}
		return null;
	}

}
