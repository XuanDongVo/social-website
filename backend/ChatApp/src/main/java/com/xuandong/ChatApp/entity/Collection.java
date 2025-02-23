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
public class Collection {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@Column(nullable = false, columnDefinition = "text")
	private String name;

	@ManyToOne
	@JoinColumn(name = "save_post_id", nullable = false)
	private SavedPost savedPost;

	@OneToMany(mappedBy = "collection", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CollectionDetail> collectionDetails;

	@Column(updatable = false, name = "create_at")
	private LocalDateTime createAt;

	@PrePersist
	public void onCreate() {
		this.createAt = LocalDateTime.now();
	}
}
