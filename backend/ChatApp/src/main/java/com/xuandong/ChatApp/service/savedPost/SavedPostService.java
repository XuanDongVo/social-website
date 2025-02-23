package com.xuandong.ChatApp.service.savedPost;

import java.util.Collections;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.response.PostResponse;
import com.xuandong.ChatApp.entity.Collection;
import com.xuandong.ChatApp.entity.CollectionDetail;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.SavedPost;
import com.xuandong.ChatApp.entity.SavedPostDetail;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.mapper.PostMapper;
import com.xuandong.ChatApp.repository.collection.CollectionDetailRepository;
import com.xuandong.ChatApp.repository.collection.CollectionRepository;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.savedPost.SavedPostDetailRepository;
import com.xuandong.ChatApp.repository.savedPost.SavedPostRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavedPostService {
	private final SavedPostDetailRepository savedPostDetailRepository;
	private final SavedPostRepository savedPostRepository;
	private final PostRepository postRepository;
	private final UserRepository userRepository;
	private final CollectionRepository collectionRepository;
	private final CollectionDetailRepository collectionDetailRepository;
	private final PostMapper postMapper;

	public SavedPost getUserSavedPost() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found by email: " + email));
		return savedPostRepository.findByUser(user).orElse(null);
	}

	public Page<PostResponse> getSavedPosts(int currentPage) {
		SavedPost savedPost = getUserSavedPost();
		if (savedPost == null) {
			return Page.empty();
		}

		Pageable pageable = PageRequest.of(currentPage, 12);

		Page<SavedPostDetail> savedPostDetails = savedPostDetailRepository.findBySavedPost(savedPost, pageable);

		return savedPostDetails
				.map(savedPostDetail -> postMapper.postMapper(savedPostDetail.getPost(), savedPost.getUser()));
	}

	public boolean isSavedPost(Post post) {
		SavedPost savedPost = getUserSavedPost();
		if (savedPost == null) {
			return false;
		}
		SavedPostDetail savedPostDetail = savedPostDetailRepository.findBySavedPostAndPost(savedPost, post)
				.orElse(null);
		if (savedPostDetail == null) {
			return false;
		}
		return true;

	}

//	public SavedPost getSavedPostByPost(Post post) {
//		String email= SecurityContextHolder.getContext().getAuthentication().getName();
//		User user = userRepository.findByEmail(email)
//				.orElseThrow(() -> new EntityNotFoundException("User not found by email: " + email));
//		return savedPostRepository.findByUserAndPost(user,post).orElse(null);
//	}

	public SavedPost createSavedPost(User user) {
		SavedPost savedPost = new SavedPost();
		savedPost.setUser(user);
		savedPostRepository.save(savedPost);
		return savedPost;
	}

	@Transactional
	public void savePost(String postId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found by email: " + email));
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Post not found by id: " + postId));

		SavedPost savedPost = savedPostRepository.findByUser(user).orElse(null);

		if (savedPost == null) {
			savedPost = new SavedPost();
			savedPost.setUser(user);
			savedPostRepository.save(savedPost);
		}

		SavedPostDetail savedPostDetail = new SavedPostDetail();
		savedPostDetail.setSavedPost(savedPost);
		savedPostDetail.setPost(post);
		savedPostDetailRepository.save(savedPostDetail);

	}

	@Transactional
	public void deleteSavedPost(String postId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found by email: " + email));
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Post not found by id: " + postId));

		SavedPost savedPost = savedPostRepository.findByUser(user)
				.orElseThrow(() -> new EntityNotFoundException("SavedPost not found"));

		// xóa trong collection nếu có
		List<Collection> collections = collectionRepository.findBySavedPost(savedPost);
		if (collections.isEmpty()) {
			savedPostRepository.delete(savedPost);
			return;
		}

		SavedPostDetail savedPostDetail = savedPostDetailRepository.findBySavedPostAndPost(savedPost, post)
				.orElseThrow(() -> new EntityNotFoundException("Not found SavePostDetail"));

		collections.forEach(collection -> {
			CollectionDetail collectionDetail = collectionDetailRepository
					.findByCollectionAndSavedPostDetail(collection, savedPostDetail).orElseThrow(
							() -> new EntityNotFoundException("Collection not found with id: " + collection.getId()));
			collectionDetailRepository.delete(collectionDetail);
		});

	}

}
