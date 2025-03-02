package com.xuandong.ChatApp.repository.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xuandong.ChatApp.chat.ChatConstants;
import com.xuandong.ChatApp.entity.Chat;
import com.xuandong.ChatApp.entity.User;

public interface ChatRepository extends JpaRepository<Chat, String> {
	@Query(name = ChatConstants.FIND_CHAT_BY_SENDER_ID)
	List<Chat> findChatsBySenderId(@Param("senderId") String senderId);

	
	Optional<Chat> findChatBySenderAndRecipient(User sender , User receiver);

	Optional<Chat> findById(String id);
	@Query("SELECT c FROM Chat c WHERE (c.sender.id = :user1Id AND c.recipient.id = :user2Id) OR (c.sender.id = :user2Id AND c.recipient.id = :user1Id)")
	Optional<Chat> findUniqueChatByUsers(@Param("user1Id") String user1Id, @Param("user2Id") String user2Id);

}
