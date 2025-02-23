package com.xuandong.ChatApp.controller.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.xuandong.ChatApp.dto.request.LoginRequest;
import com.xuandong.ChatApp.dto.request.RegisterRequest;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.user.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
	private final UserRepository userRepository;
	private final UserService userService;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse servletResponse) {
		try {
			return ResponseEntity
					.ok(userService.login(loginRequest.getEmail(), loginRequest.getPassword(), servletResponse));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại!");
		}
	}

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED) 
	public void register(@RequestBody RegisterRequest request) {
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại!");
		}
		userService.createUser(request);
	}

}
