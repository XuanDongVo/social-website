package com.xuandong.ChatApp.controller.user;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.xuandong.ChatApp.dto.request.LoginRequest;
import com.xuandong.ChatApp.dto.request.RegisterRequest;
import com.xuandong.ChatApp.dto.response.user.ProfileResponse;
import com.xuandong.ChatApp.dto.response.user.UserResponse;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.service.user.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

//	@GetMapping
//	public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(name = "id")  String userId) {
//		return ResponseEntity.ok(userService.getAllUsersExceptSelf(userId));
//	}
	
	@GetMapping("/profile")
	public ResponseEntity<ProfileResponse> getProfileUser(@RequestParam("id") String userId){
		return ResponseEntity.ok(userService.getProfileUser(userId));
	}


}