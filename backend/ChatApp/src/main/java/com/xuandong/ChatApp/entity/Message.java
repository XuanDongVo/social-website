package com.xuandong.ChatApp.entity;

import java.util.ArrayList;
import java.util.List;

import com.xuandong.ChatApp.message.MessageConstants;
import com.xuandong.ChatApp.utils.MessageState;
import com.xuandong.ChatApp.utils.MessageType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
@Table(name = "messages")
@NamedQuery(name = MessageConstants.FIND_MESSAGES_BY_CHAT_ID, query = "SELECT m FROM Message m WHERE m.chat.id = :chatId ORDER BY m.createdDate")
@NamedQuery(name = MessageConstants.SET_MESSAGES_TO_SEEN_BY_CHAT, query = "UPDATE Message SET state = :newState WHERE chat.id = :chatId")
public class Message extends BaseAuditingEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(columnDefinition = "TEXT")
	private String content;
	@Enumerated(EnumType.STRING)
	private MessageState state;
	@Enumerated(EnumType.STRING)
	private MessageType type;
	@ManyToOne
	@JoinColumn(name = "chat_id")
	private Chat chat;
	@Column(name = "sender_id", nullable = false)
	private String senderId;
	@Column(name = "receiver_id", nullable = false)
	private String receiverId;

	@OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<MessageMedia> mediaFiles = new ArrayList<>();
}