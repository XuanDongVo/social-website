package com.xuandong.ChatApp.entity;

import com.xuandong.ChatApp.chat.ChatConstants;
import com.xuandong.ChatApp.enums.MessageState;
import com.xuandong.ChatApp.enums.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chat")
@NamedQuery(name = ChatConstants.FIND_CHAT_BY_SENDER_ID, query = "SELECT DISTINCT c FROM Chat c WHERE c.sender.id = :senderId OR c.recipient.id = :senderId ORDER BY createdDate DESC")
public class Chat extends BaseAuditingEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	@ManyToOne
	@JoinColumn(name = "sender_id")
	private User sender;
	@ManyToOne
	@JoinColumn(name = "recipient_id")
	private User recipient;
	@OneToMany(mappedBy = "chat", fetch = FetchType.LAZY)
	@OrderBy("createdDate DESC")
	private List<Message> messages;

	@Column(name = "chat_key", unique = true, nullable = false)
	private String chatKey;

//	public void setChatKey(String user1Id, String user2Id) {
//		this.chatKey = Stream.of(user1Id, user2Id)
//				.sorted()
//				.collect(Collectors.joining("_"));
//	}

	@Transient
	public String getChatName(String senderId) {
		if (recipient.getId().equals(senderId)) {
			return sender.getFirstName() + " " + sender.getLastName();
		}
		return recipient.getFirstName() + " " + recipient.getLastName();
	}

	@Transient
	public String getTargetChatName(String senderId) {
		if (sender.getId().equals(senderId)) {
			return sender.getFirstName() + " " + sender.getLastName();
		}
		return recipient.getFirstName() + " " + recipient.getLastName();
	}

	@Transient
	public long getUnreadMessages(String senderId) {
		return this.messages.stream().filter(m -> m.getReceiverId().equals(senderId))
				.filter(m -> MessageState.SENT == m.getState()).count();
	}

	@Transient
	public String getLastMessage() {
		if (messages != null && !messages.isEmpty()) {
			if (messages.getFirst().getType() != MessageType.TEXT) {
				return "Attachment";
			}
			return messages.getFirst().getContent();
		}
		return null; // No messages available
	}

	@Transient
	public LocalDateTime getLastMessageTime() {
		if (messages != null && !messages.isEmpty()) {
			return messages.getFirst().getCreatedDate();
		}
		return null;
	}
}
