package com.xuandong.ChatApp.repository.savedPost;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.SavedPost;
import com.xuandong.ChatApp.entity.SavedPostDetail;


public interface SavedPostDetailRepository extends JpaRepository<SavedPostDetail, String> {
	Optional<SavedPostDetail> findBySavedPostAndPost(SavedPost savedPost ,Post post);
	
	Page<SavedPostDetail> findBySavedPost(SavedPost savedPost , Pageable pageable);

	boolean existsBySavedPost(SavedPost savedPost);
}
