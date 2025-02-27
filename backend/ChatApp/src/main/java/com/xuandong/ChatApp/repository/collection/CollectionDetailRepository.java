package com.xuandong.ChatApp.repository.collection;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Collection;
import com.xuandong.ChatApp.entity.CollectionDetail;
import com.xuandong.ChatApp.entity.SavedPost;
import com.xuandong.ChatApp.entity.SavedPostDetail;
public interface CollectionDetailRepository extends JpaRepository<CollectionDetail, String> {
	Optional<CollectionDetail> findByCollectionAndSavedPostDetail(Collection collection,
			SavedPostDetail savedPostDetail);
	
	Page<CollectionDetail> findByCollection(Collection collection, Pageable pageable);
	
	List<CollectionDetail> findBySavedPostDetail(SavedPostDetail savedPostDetail);

	boolean existsByCollectionAndSavedPostDetail(Collection collection, SavedPostDetail savedPostDetail);
}
