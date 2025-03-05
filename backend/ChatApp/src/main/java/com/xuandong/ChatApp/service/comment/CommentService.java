package com.xuandong.ChatApp.service.comment;

import java.util.List;

import com.xuandong.ChatApp.dto.request.CommentRequestDTO;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
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
	private final UserRepository userRepository;
	private final PostRepository postRepository;

	public List<CommentResponse> getCommentInPost(String postId, int currentPage) {
		// Lấy 20 comment cha theo trang
		Pageable pageable = PageRequest.of(currentPage, 20);
		Page<Comment> parentComments = commentRepository.findParentCommentsByPostId(postId, pageable);

		// Convert mỗi comment cha thành CommentResponse kèm danh sách replies
	return parentComments.getContent().stream()
				.map(this::convertCommentToResponse).toList();
	}

	// Chuyển đổi Comment -> CommentResponse và lấy replies
	private CommentResponse convertCommentToResponse(Comment parentComment) {
		List<Comment> replies = commentRepository.findRepliesByParentId(parentComment.getId());
		return commentMapper.mapToDto(parentComment, replies);
	}

	public void addComment(CommentRequestDTO commentRequestDTO){
		User user = userRepository.findById(commentRequestDTO.getSenderId()).orElseThrow(EntityNotFoundException::new);
		Post post = postRepository.findById(commentRequestDTO.getPostId()).orElseThrow(EntityNotFoundException::new);
		Comment comment = new Comment();
		comment.setSender(user);
		comment.setPost(post);
		comment.setContent(commentRequestDTO.getContent());
		if(commentRequestDTO.getParentCommentId() != null){
			Comment commentParent = commentRepository.findById(commentRequestDTO.getParentCommentId()).orElseThrow(EntityNotFoundException::new);
			comment.setParentComment(commentParent);
		}
		commentRepository.save(comment);
	}

	public void deleteComment(String commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new EntityNotFoundException("Comment not found:" + commentId));
		commentRepository.delete(comment);
	}

}
