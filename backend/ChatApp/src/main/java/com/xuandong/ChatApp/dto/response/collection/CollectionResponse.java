package com.xuandong.ChatApp.dto.response.collection;

import com.xuandong.ChatApp.dto.response.PostResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionResponse {
    private  String collectionId;
    private String name;
    private List<PostResponse> posts;
}
