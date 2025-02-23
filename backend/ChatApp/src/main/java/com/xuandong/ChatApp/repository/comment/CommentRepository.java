package com.xuandong.ChatApp.repository.comment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.xuandong.ChatApp.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, String> {

	@Query("SELECT c FROM Comment c WHERE c.post.id = :id AND c.parentComment IS NULL")
	Page<Comment> findParentCommentsByPostId(@Param("id") String postId, Pageable pageable);

	@Query("SELECT c FROM Comment c WHERE c.parentComment.id = :parentId")
	List<Comment> findRepliesByParentId(@Param("parentId") String parentId);

	Optional<Comment> findById(String id);

}
