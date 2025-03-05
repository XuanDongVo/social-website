package com.xuandong.ChatApp.service.message;

import com.xuandong.ChatApp.dto.request.MessageRequest;
import com.xuandong.ChatApp.dto.response.MessageResponse;
import com.xuandong.ChatApp.dto.response.NotificationChatResponse;
import com.xuandong.ChatApp.entity.Chat;
import com.xuandong.ChatApp.entity.Message;
import com.xuandong.ChatApp.entity.MessageMedia;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.enums.MessageState;
import com.xuandong.ChatApp.enums.MessageType;
import com.xuandong.ChatApp.enums.NotificationType;
import com.xuandong.ChatApp.mapper.MessageMapper;
import com.xuandong.ChatApp.repository.chat.ChatRepository;
import com.xuandong.ChatApp.repository.message.MessageMediaRepository;
import com.xuandong.ChatApp.repository.message.MessageRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.file.FileService;
import com.xuandong.ChatApp.service.notification.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
	private final MessageRepository messageRepository;
	private final ChatRepository chatRepository;
	private final MessageMapper mapper;
	private final NotificationService notificationService;
	private final UserRepository userRepository;
	private final MessageMediaRepository messageMediaRepository;

	public void saveMessage(MessageRequest messageRequest) {
		Chat chat = chatRepository.findById(messageRequest.getChatId())
				.orElseThrow(() -> new EntityNotFoundException("Chat not found"));

		Message message = new Message();
		message.setContent(messageRequest.getContent());
		message.setChat(chat);
		message.setSenderId(messageRequest.getSenderId());
		message.setReceiverId(messageRequest.getReceiverId());
		message.setType(MessageType.valueOf(messageRequest.getType().name()));
		message.setState(MessageState.SENT);
		messageRepository.save(message);

		// Xử lý nếu tin nhắn là IMAGE
		if (MessageType.IMAGE.equals(messageRequest.getType())) {
			MessageMedia messageMedia = new MessageMedia();
			messageMedia.setMessage(message);
			messageMedia.setFilePath(messageRequest.getUrlImage());
			messageMediaRepository.save(messageMedia);
		}

		// Xây dựng thông báo
		NotificationType notificationType = MessageType.IMAGE.equals(messageRequest.getType())
				? NotificationType.IMAGE
				: NotificationType.MESSAGE;

		NotificationChatResponse notification = NotificationChatResponse.builder()
				.chatId(chat.getId())
				.content(messageRequest.getContent())
				.senderId(messageRequest.getSenderId())
				.receiverId(messageRequest.getReceiverId())
				.chatName(chat.getChatName(messageRequest.getSenderId()))
				.messageType(MessageType.valueOf(messageRequest.getType().name()))
				.notificationType(notificationType)
				.createdAt(LocalDateTime.now())
				.pathImage(messageRequest.getUrlImage())
				.build();

		notificationService.sendMessage(messageRequest.getReceiverId(), notification);
	}

	public List<MessageResponse> findChatMessages(String chatId) {
		return messageRepository.findMessagesByChatId(chatId).stream().map(mapper::toMessageResponse).toList();
	}

	@Transactional
	public void setMessageToSent(String chatId) {
		User user = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new EntityNotFoundException("User not found"));
		Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
		final String recipientId = getRecipientId(chat, user);
		messageRepository.setMessagesToSeenByChatId(chatId, MessageState.SEEN);

		NotificationChatResponse notification = NotificationChatResponse.builder().chatId(chat.getId())
				.notificationType(NotificationType.SEEN)
				.receiverId(recipientId).senderId(getSenderId(chat, user)).build();

		notificationService.sendMessage(recipientId, notification);

	}


	private String getSenderId(Chat chat,User user) {
		if (chat.getSender().getId().equals(user.getId())) {
			return chat.getSender().getId();
		}
		return chat.getRecipient().getId();
	}

	private String getRecipientId(Chat chat,User user) {
		if (chat.getSender().getId().equals(user.getId())) {
			return chat.getRecipient().getId();
		}
		return chat.getSender().getId();
	}

}
