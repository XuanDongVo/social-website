package com.xuandong.ChatApp.repository.collection;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Collection;
import com.xuandong.ChatApp.entity.CollectionDetail;
import com.xuandong.ChatApp.entity.SavedPost;
import com.xuandong.ChatApp.entity.SavedPostDetail;
public interface CollectionDetailRepository extends JpaRepository<CollectionDetail, String> {
	Optional<CollectionDetail> findByCollectionAndSavedPostDetail(Collection collection,
			SavedPostDetail savedPostDetail);
}
