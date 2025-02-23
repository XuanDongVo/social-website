package com.xuandong.ChatApp.controller.message;

import java.util.List;

import org.hibernate.annotations.Parameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.xuandong.ChatApp.dto.request.MessageRequest;
import com.xuandong.ChatApp.dto.response.MessageResponse;
import com.xuandong.ChatApp.service.message.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

	private final MessageService messageService;

	@MessageMapping("/chat/{chatId}") // Endpoint cho client gửi message
	public void saveMessage(@RequestBody MessageRequest message) {
		messageService.saveMessage(message);
	}

	@PostMapping(value = "/upload-media", consumes = "multipart/form-data")
	@ResponseStatus(HttpStatus.CREATED)
	public void uploadMedia(@RequestBody MessageRequest messageRequest,

			@RequestPart("file") List<MultipartFile> file, Authentication authentication) {
		messageService.uploadFileMediaMessage(messageRequest, authentication, file);
	}

	@PatchMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public void setMessageToSeen(@RequestParam("chat-id") String chatId, Authentication authentication) {
		messageService.setMessageToSent(chatId, authentication);
	}	

	@GetMapping("/chat/{chat-id}")
	public ResponseEntity<List<MessageResponse>> getAllMessages(@PathVariable("chat-id") String chatId) {
		return ResponseEntity.ok(messageService.findChatMessages(chatId));
	}
}
