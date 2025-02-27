package com.xuandong.ChatApp.service.savedPost;

import java.util.List;
import java.util.Objects;

import com.xuandong.ChatApp.dto.response.savedPost.PreviewSavedPostImageResponse;
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


	public PreviewSavedPostImageResponse getPreviewSavedPost() {
		SavedPost savedPost = getUserSavedPost();
		if (savedPost == null) {
			return null;
		}
		Pageable pageable = PageRequest.of(0, 4);
		Page<SavedPostDetail> savedPostDetails = savedPostDetailRepository.findBySavedPost(savedPost, pageable);

		return PreviewSavedPostImageResponse.builder()
				.name("All-Posts")
				.images(savedPostDetails.getContent().stream()
						.map(savedPostDetail ->
								savedPostDetail.getPost().getPostImages().isEmpty()
										? null
										: savedPostDetail.getPost().getPostImages().getFirst().getUrlImage()
						)
						.filter(Objects::nonNull) // Lọc bỏ các giá trị null
						.toList()
				)
				.build();
	}


	public Page<PostResponse> getSavedPost(int currentPage) {
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
        return savedPostDetail != null;

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

		SavedPostDetail savedPostDetail = savedPostDetailRepository.findBySavedPostAndPost(savedPost, post)
				.orElseThrow(() -> new EntityNotFoundException("SavedPostDetail not found"));

		// Lấy danh sách collections chứa savedPostDetail
		List<CollectionDetail> collectionDetails = collectionDetailRepository.findBySavedPostDetail(savedPostDetail);

		// Nếu savedPostDetail tồn tại trong collection nào đó, xóa nó khỏi collection trước
		if (!collectionDetails.isEmpty()) {
			collectionDetailRepository.deleteAll(collectionDetails);
		}

		// Xóa savedPostDetail
		savedPostDetailRepository.delete(savedPostDetail);

		// Kiểm tra nếu savedPost không còn chi tiết nào, thì xóa luôn savedPost
		if (!savedPostDetailRepository.existsBySavedPost(savedPost)) {
			savedPostRepository.delete(savedPost);
		}
	}


}
