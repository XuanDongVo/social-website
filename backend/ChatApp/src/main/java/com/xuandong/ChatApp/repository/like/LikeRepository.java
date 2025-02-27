package com.xuandong.ChatApp.repository.like;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Like;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.User;

public interface LikeRepository extends JpaRepository<Like, String> {
	Optional<Like> findByUserAndPost(User user, Post post);
	List<Like> findByPost(Post post);
}
