package com.xuandong.ChatApp.repository.savedPost;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.SavedPost;
import com.xuandong.ChatApp.entity.User;

public interface SavedPostRepository extends JpaRepository<SavedPost, String> {
//	Optional<SavedPost>  findByUserAndPost(User user , Post post);
	Optional<SavedPost>  findByUser(User user );
}
