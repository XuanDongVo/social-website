package com.xuandong.ChatApp.repository.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.xuandong.ChatApp.entity.Post;

public interface PostRepository extends JpaRepository<Post, String> {

	Page<Post> findAll(Pageable pageable);

	Optional<Post> findById(String id);

	@Query("SELECT p FROM Post p WHERE p.user.id = :id")
	Page<Post> getSelfPosts(@Param("id") String userId, Pageable page);
	
	 List<Post> findAllById(Iterable<String> ids) ;

}
