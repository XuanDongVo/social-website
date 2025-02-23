package com.xuandong.ChatApp.service.comment;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.CommentResponse;
import com.xuandong.ChatApp.entity.Comment;
import com.xuandong.ChatApp.mapper.CommentMapper;
import com.xuandong.ChatApp.repository.comment.CommentRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	private final CommentMapper commentMapper;

	public Page<CommentResponse> getCommentInPost(String postId, int currentPage) {
		// Lấy 20 comment cha theo trang
		Pageable pageable = PageRequest.of(currentPage, 20);
		Page<Comment> parentComments = commentRepository.findParentCommentsByPostId(postId, pageable);

		// Convert mỗi comment cha thành CommentResponse kèm danh sách replies
		List<CommentResponse> commentResponses = parentComments.getContent().stream()
				.map(this::convertCommentToResponse).toList();

		return new PageImpl<>(commentResponses, pageable, parentComments.getTotalElements());
	}

	// Chuyển đổi Comment -> CommentResponse và lấy replies
	private CommentResponse convertCommentToResponse(Comment parentComment) {
		List<Comment> replies = commentRepository.findRepliesByParentId(parentComment.getId());
		return commentMapper.mapToDto(parentComment, replies);
	}

	public void deleteComment(String commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new EntityNotFoundException("Comment not found:" + commentId));
		commentRepository.delete(comment);
	}

}
