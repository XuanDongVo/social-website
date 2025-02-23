package com.xuandong.ChatApp.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Story {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User owner;

	@Column(name = "url_image", nullable = false)
	private String urlImage;

	@OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<StoryView> storyViews;

	@Column(name = "create_at")
	private LocalDateTime createAt;

	@Transient
	public boolean checkIsSeen(String currentUserId) {
		return storyViews.stream().anyMatch(view -> view.getViewer().getId().equals(currentUserId));
	}
}
