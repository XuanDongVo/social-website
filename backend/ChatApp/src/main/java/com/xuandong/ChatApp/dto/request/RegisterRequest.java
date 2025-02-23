package com.xuandong.ChatApp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor	
@AllArgsConstructor
@Builder
public class RegisterRequest {
	private String email;
	private String password;
	private String firstName;
	private String lastName;

}
