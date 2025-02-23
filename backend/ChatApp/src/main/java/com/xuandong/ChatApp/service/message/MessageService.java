package com.xuandong.ChatApp.service.message;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.xuandong.ChatApp.dto.request.MessageRequest;
import com.xuandong.ChatApp.dto.response.MessageResponse;
import com.xuandong.ChatApp.entity.Chat;
import com.xuandong.ChatApp.entity.Message;
import com.xuandong.ChatApp.entity.MessageMedia;
import com.xuandong.ChatApp.entity.NotificationChat;
import com.xuandong.ChatApp.mapper.MessageMapper;
import com.xuandong.ChatApp.repository.chat.ChatRepository;
import com.xuandong.ChatApp.repository.message.MessageRepository;
import com.xuandong.ChatApp.service.file.FileService;
import com.xuandong.ChatApp.service.notification.NotificationService;
import com.xuandong.ChatApp.utils.MessageState;
import com.xuandong.ChatApp.utils.MessageType;
import com.xuandong.ChatApp.utils.NotificationType;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
	private final MessageRepository messageRepository;
	private final ChatRepository chatRepository;
	private final MessageMapper mapper;
	private final FileService fileService;
	private final NotificationService notificationService;

	public void saveMessage(MessageRequest messageRequest) {
		Chat chat = chatRepository.findById(messageRequest.getChatId())
				.orElseThrow(() -> new EntityNotFoundException("Chat not found"));

		Message message = new Message();
		message.setContent(messageRequest.getContent());
		message.setChat(chat);
		message.setSenderId(messageRequest.getSenderId());
		message.setReceiverId(messageRequest.getReceiverId());
		message.setType(messageRequest.getType());
		message.setState(MessageState.SENT);

		messageRepository.save(message);

		NotificationChat notification = NotificationChat.builder().chatId(chat.getId())
				.messageType(messageRequest.getType()).content(messageRequest.getContent())
				.senderId(messageRequest.getSenderId()).receiverId(messageRequest.getReceiverId())
				.type(NotificationType.MESSAGE).chatName(chat.getChatName(message.getSenderId())).build();

		notificationService.sendNotification(messageRequest.getReceiverId(), notification);
	}

	public List<MessageResponse> findChatMessages(String chatId) {
		return messageRepository.findMessagesByChatId(chatId).stream().map(mapper::toMessageResponse).toList();
	}

	@Transactional
	public void setMessageToSent(String chatId, Authentication authentication) {
		Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
		final String recipientId = getRecipientId(chat, authentication);
		messageRepository.setMessagesToSeenByChatId(chatId, MessageState.SEEN);

		NotificationChat notification = NotificationChat.builder().chatId(chat.getId()).type(NotificationType.SEEN)
				.receiverId(recipientId).senderId(getSenderId(chat, authentication)).build();

		notificationService.sendNotification(recipientId, notification);

	}

	// gửi tin nhắn bằng file ảnh
	@Transactional
	public void uploadFileMediaMessage(MessageRequest messageRequest, Authentication authentication,
			List<MultipartFile> files) {
		Chat chat = chatRepository.findById(messageRequest.getChatId())
				.orElseThrow(() -> new EntityNotFoundException("Chat not found"));


		Message message = new Message();
		message.setReceiverId(messageRequest.getReceiverId());
		message.setSenderId(messageRequest.getSenderId());
		message.setContent(messageRequest.getContent());
		message.setState(MessageState.SENT);
		message.setType(MessageType.IMAGE);
		message.setChat(chat);
		messageRepository.save(message);

		// luu anh
		files.forEach(file -> {
			try {
				String urlFile = fileService.uploadImageToCloudinary(file);
				MessageMedia messageMedia = new MessageMedia();
				messageMedia.setMessage(message);
				messageMedia.setFilePath(urlFile);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		});

		NotificationChat notification = NotificationChat.builder().chatId(chat.getId()).type(NotificationType.IMAGE)
				.senderId(messageRequest.getSenderId()).receiverId(messageRequest.getReceiverId())
				.messageType(MessageType.IMAGE)
				.urlFiles(message.getMediaFiles().stream().map(MessageMedia::getFilePath).toList()) 
				.build();

		notificationService.sendNotification(messageRequest.getReceiverId(), notification);

	}

	private String getSenderId(Chat chat, Authentication authentication) {
		if (chat.getSender().getId().equals(authentication.getName())) {
			return chat.getSender().getId();
		}
		return chat.getRecipient().getId();
	}

	private String getRecipientId(Chat chat, Authentication authentication) {
		if (chat.getSender().getId().equals(authentication.getName())) {
			return chat.getRecipient().getId();
		}
		return chat.getSender().getId();
	}

}
