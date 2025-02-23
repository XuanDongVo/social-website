package com.xuandong.ChatApp.service.collection;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.entity.Collection;
import com.xuandong.ChatApp.entity.CollectionDetail;
import com.xuandong.ChatApp.entity.Post;
import com.xuandong.ChatApp.entity.SavedPost;
import com.xuandong.ChatApp.entity.SavedPostDetail;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.repository.collection.CollectionDetailRepository;
import com.xuandong.ChatApp.repository.collection.CollectionRepository;
import com.xuandong.ChatApp.repository.post.PostRepository;
import com.xuandong.ChatApp.repository.savedPost.SavedPostDetailRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.savedPost.SavedPostService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollectionService {

	private final SavedPostService savedPostService;
	private final UserRepository userRepository;
	private final CollectionRepository collectionRepository;
	private final SavedPostDetailRepository savedPostDetailRepository;
	private final PostRepository postRepository;
	private final CollectionDetailRepository collectionDetailRepository;

	@Transactional
	public void createCollection( List<String> savedPostDetails, String collectionName) {
		SavedPost savedPost = savedPostService.getUserSavedPost();

		if (savedPost == null) {
			String email= SecurityContextHolder.getContext().getAuthentication().getName();
			User user = userRepository.findByEmail(email)
					.orElseThrow(() -> new EntityNotFoundException("User not found by email: " + email));
			savedPost = savedPostService.createSavedPost(user);
		}

		final SavedPost finalSavedPost = savedPost;

		Collection collection = new Collection();
		collection.setSavedPost(finalSavedPost);
		collection.setName(collectionName);

		collectionRepository.save(collection);

		if (!savedPostDetails.isEmpty()) {
			savedPostDetails.forEach(savePostDetail -> {
				CollectionDetail collectionDetail = new CollectionDetail();
				collectionDetail.setCollection(collection);

				Post post = postRepository.findById(savePostDetail)
						.orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + savePostDetail));

				SavedPostDetail detail = savedPostDetailRepository.findBySavedPostAndPost(finalSavedPost, post)
						.orElseThrow(() -> new EntityNotFoundException("SavedPostDetail not found"));

				collectionDetail.setSavedPostDetail(detail);

				collectionDetailRepository.save(collectionDetail);
			});
		}
	}

	public void modifyCollectionName(String collectionId, String collectionName) {
		Collection collection = collectionRepository.findById(collectionId)
				.orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));
		collection.setName(collectionName);
		collectionRepository.save(collection);
	}

	@Transactional
	public void addSavedPostInCollection(String collectionId, List<String> savedPostDetails
		) {
		SavedPost savedPost = savedPostService.getUserSavedPost();

		Collection collection = collectionRepository.findById(collectionId)
				.orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));

		savedPostDetails.forEach(savePostDetail -> {
			CollectionDetail collectionDetail = new CollectionDetail();
			collectionDetail.setCollection(collection);

			Post post = postRepository.findById(savePostDetail)
					.orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + savePostDetail));

			SavedPostDetail detail = savedPostDetailRepository.findBySavedPostAndPost(savedPost, post)
					.orElseThrow(() -> new EntityNotFoundException("SavedPostDetail not found"));

			collectionDetail.setSavedPostDetail(detail);

			collectionDetailRepository.save(collectionDetail);
		});
	}

	@Transactional
	public void deleteSavedPostInCollection(String collectionId, String postId) {
		SavedPost savedPost = savedPostService.getUserSavedPost();

		Collection collection = collectionRepository.findById(collectionId)
				.orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + postId));

		SavedPostDetail detail = savedPostDetailRepository.findBySavedPostAndPost(savedPost, post)
				.orElseThrow(() -> new EntityNotFoundException("SavedPostDetail not found"));

		CollectionDetail collectionDetail = collectionDetailRepository
				.findByCollectionAndSavedPostDetail(collection, detail)
				.orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));

		collectionDetailRepository.delete(collectionDetail);

	}

	@Transactional
	public void deleteColletion(String collectionId) {
		Collection collection = collectionRepository.findById(collectionId)
				.orElseThrow(() -> new EntityNotFoundException("Collection not found with id: " + collectionId));
		collectionRepository.delete(collection);
	}
}
