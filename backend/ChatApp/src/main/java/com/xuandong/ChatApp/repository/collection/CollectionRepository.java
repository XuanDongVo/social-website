package com.xuandong.ChatApp.repository.collection;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Collection;
import com.xuandong.ChatApp.entity.SavedPost;

public interface CollectionRepository extends JpaRepository<Collection, String> {
	Optional<Collection> findById(String id);
	
	List<Collection> findBySavedPost(SavedPost savedPost);
}
