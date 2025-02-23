package com.xuandong.ChatApp.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.PostResponse;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.PostImages;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.service.savedPost.SavedPostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostMapper {
	private final UserMapper userMapper;
	private SavedPostService savedPostService;

    @Lazy
    @Autowired
    public void setSavedPostService(SavedPostService savedPostService) {
        this.savedPostService = savedPostService;
    }

	public PostResponse postMapper(Post post, User user) {
		Set<String> likedUserIds = post.getListUserLike().stream().map(userLike -> userLike.getId())
				.collect(Collectors.toSet());

		boolean isSelfLike = likedUserIds.contains(user.getId());
		
		boolean isSavedPost = savedPostService.isSavedPost(post);


		return PostResponse.builder().postId(post.getId()).caption(post.getContent())
				.user(userMapper.toUserResponse(post.getUser()))
				.images(post.getPostImages().stream().map(PostImages::getUrlImage).toList())
				.isSelfLike(isSelfLike)
				.isSavedPost(isSavedPost)
				.countComments(post.countComment())
				.countLikes(post.countLikes())
				.listUsersLike(post.getListUserLike().stream().map(userMapper::toUserResponse).toList()).build();
	}
}
