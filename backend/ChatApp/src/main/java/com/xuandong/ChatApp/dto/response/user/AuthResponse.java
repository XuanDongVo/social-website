package com.xuandong.ChatApp.dto.response.user;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
	private String id ;
	private String email;
	private String name;
	private String accessToken;
}
