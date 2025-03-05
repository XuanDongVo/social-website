package com.xuandong.ChatApp.controller.user;

import java.util.List;

import com.xuandong.ChatApp.dto.request.EditProfileRequest;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfileUser(@RequestParam("id") String userId) {
        return ResponseEntity.ok(userService.getProfileUser(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUser(@RequestParam("search") String keyword) {
        List<UserResponse> users = userService.searchUser(keyword);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findUserById(@PathVariable("id") String userId) {
        return ResponseEntity.ok(userService.findById(userId));
    }

    @PostMapping("/account/update")
    @ResponseStatus(HttpStatus.OK)
    public void updateProfile(@RequestBody EditProfileRequest editProfileRequest) {
        userService.editProfile(editProfileRequest);
    }

	@PatchMapping("/account/picture")
	public void changProfilePicture(@RequestParam("urlImage") String profilePicture , @RequestParam("id") String userId) {
		userService.changeProfilePicture(profilePicture, userId);
	}


}