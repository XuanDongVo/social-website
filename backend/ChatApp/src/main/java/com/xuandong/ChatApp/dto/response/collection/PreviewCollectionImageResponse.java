package com.xuandong.ChatApp.dto.response.collection;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreviewCollectionImageResponse {
    private String collectionId;
    private String name;
    private List<String> images;
}
