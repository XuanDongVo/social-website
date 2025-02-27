package com.xuandong.ChatApp.dto.response.user;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SimpleUserResponse {
    private String id;
    private String firstName;
    private String lastName;
}
