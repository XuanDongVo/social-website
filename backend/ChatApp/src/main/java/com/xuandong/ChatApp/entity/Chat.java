package com.xuandong.ChatApp.entity;

import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.List;

import com.xuandong.ChatApp.chat.ChatConstants;
import com.xuandong.ChatApp.enums.MessageState;
import com.xuandong.ChatApp.enums.MessageType;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
	@OneToMany(mappedBy = "chat", fetch = FetchType.EAGER)
	@OrderBy("createdDate DESC")
	private List<Message> messages;

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
			if (messages.get(0).getType() != MessageType.TEXT) {
				return "Attachment";
			}
			return messages.get(0).getContent();
		}
		return null; // No messages available
	}

	@Transient
	public LocalDateTime getLastMessageTime() {
		if (messages != null && !messages.isEmpty()) {
			return messages.get(0).getCreatedDate();
		}
		return null;
	}
}
