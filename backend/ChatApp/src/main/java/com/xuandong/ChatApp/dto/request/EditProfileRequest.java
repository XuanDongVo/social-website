package com.xuandong.ChatApp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class    EditProfileRequest {
    private String id;
    private String firstName;
    private String lastName;
    private String bio;
}
