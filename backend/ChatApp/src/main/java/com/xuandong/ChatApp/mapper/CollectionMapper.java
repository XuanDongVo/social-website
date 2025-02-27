package com.xuandong.ChatApp.mapper;

import com.xuandong.ChatApp.dto.response.collection.CollectionResponse;
import com.xuandong.ChatApp.entity.Collection;
import com.xuandong.ChatApp.entity.CollectionDetail;
import com.xuandong.ChatApp.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionMapper {
    private final PostMapper postMapper;

    public CollectionResponse toCollectionResponse(Collection collection , List<CollectionDetail> details, User user){
    return CollectionResponse.builder()
            .collectionId(collection.getId())
            .name(collection.getName())
            .posts(details.stream()
                    .map(collectionDetail -> postMapper.postMapper(collectionDetail.getSavedPostDetail().getPost(), user)).toList())
            .build();
    }
}
