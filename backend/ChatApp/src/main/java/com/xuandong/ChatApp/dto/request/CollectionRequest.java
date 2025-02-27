package com.xuandong.ChatApp.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CollectionRequest {
    private List<String> postIds;
    private String name;
    private String collectionId;
}
