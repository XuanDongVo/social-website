package com.xuandong.ChatApp.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.CommentResponse;
import com.xuandong.ChatApp.entity.Comment;

@Service
public class CommentMapper {

	public CommentResponse mapToDto(Comment comment, List<Comment> replies) {
		CommentResponse dto = new CommentResponse();
		dto.setId(comment.getId());
		dto.setContent(comment.getContent());
		dto.setSenderId(comment.getSender().getId());
		dto.setSenderName(comment.getSender().getFirstName() + comment.getSender().getLastName());
		dto.setCreateAt(comment.getCreateAt());

		// đệ quy 
		if (replies != null) {
			dto.setReplies(replies.stream().map(reply -> this.mapToDto(reply, reply.getReplies())).toList());
		}

		return dto;
	}

}
