package com.xuandong.ChatApp.controller.chat;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xuandong.ChatApp.dto.response.ChatResponse;
import com.xuandong.ChatApp.dto.response.StringResponse;
import com.xuandong.ChatApp.service.chat.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chats")
public class ChatController {
	private final ChatService chatService;

	@PostMapping
	public ResponseEntity<StringResponse> createChat(@RequestParam(name = "sender-id") String senderId,
			@RequestParam(name = "receiver-id") String receiverId) {
		String chatId = chatService.createChat(senderId, receiverId);
		StringResponse response = StringResponse.builder().response(chatId).build();
		return ResponseEntity.ok(response);

	}

	@GetMapping
	public ResponseEntity<List<ChatResponse>> getChatsByReceiver(@RequestParam("sender-id") String id) {
		return ResponseEntity.ok(chatService.getChatsByReceiver(id));
	}

	@GetMapping("/get")
	public ResponseEntity<ChatResponse> findById(@RequestParam("chat-id") String id) {
		ChatResponse existChat = chatService.findById(id);
		return ResponseEntity.ok(existChat);
	}

}
