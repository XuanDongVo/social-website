package com.xuandong.ChatApp.dto.response.savedPost;

import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreviewSavedPostImageResponse {
    private String name;
    private List<String> images;
}
