	package com.xuandong.ChatApp.entity;
	
	import java.time.LocalDateTime;
	import java.util.ArrayList;
	import java.util.List;
	
	import jakarta.persistence.CascadeType;
	import jakarta.persistence.Column;
	import jakarta.persistence.Entity;
	import jakarta.persistence.FetchType;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	import jakarta.persistence.JoinColumn;
	import jakarta.persistence.ManyToOne;
	import jakarta.persistence.OneToMany;
	import jakarta.persistence.PrePersist;
	import lombok.AllArgsConstructor;
	import lombok.Getter;
	import lombok.NoArgsConstructor;
	import lombok.Setter;
	
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Entity
	public class Comment {
	
		@Id
		@GeneratedValue(strategy = GenerationType.UUID)
		private String id;
	
		@Column(columnDefinition = "TEXT", nullable = false)
		private String content;
	
		@ManyToOne(fetch = FetchType.LAZY)
		@JoinColumn(name = "sender_id", nullable = false)
		private User sender;
	
		@ManyToOne(fetch = FetchType.LAZY)
		@JoinColumn(name = "post_id", nullable = false)
		private Post post;
	
		// Hỗ trợ trả lời bình luận (comment lồng nhau)
		@ManyToOne(fetch = FetchType.LAZY)
		@JoinColumn(name = "parent_comment_id", referencedColumnName = "id")
		private Comment parentComment;
	
		@OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
		private List<Comment> replies = new ArrayList<>();
	
		@Column(nullable = false, updatable = false)
		private LocalDateTime createAt;
	
		@PrePersist
		public void onCreate() {
			this.createAt = LocalDateTime.now();
		}
	}
