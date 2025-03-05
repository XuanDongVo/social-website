package com.xuandong.ChatApp.mapper;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.CommentResponse;
import com.xuandong.ChatApp.entity.Comment;

@Service
@RequiredArgsConstructor
public class CommentMapper {
	private final UserMapper userMapper;

	public CommentResponse mapToDto(Comment comment, List<Comment> replies) {
		CommentResponse dto = new CommentResponse();
		dto.setId(comment.getId());
		dto.setContent(comment.getContent());
		dto.setSender(userMapper.toUserResponse(comment.getSender()));
		dto.setCreateAt(comment.getCreateAt());

		// đệ quy 
		if (replies != null) {
			dto.setReplies(replies.stream().map(reply -> this.mapToDto(reply, reply.getReplies())).toList());
		}

		return dto;
	}

}
