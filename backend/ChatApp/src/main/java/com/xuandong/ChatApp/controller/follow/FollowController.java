package com.xuandong.ChatApp.controller.follow;

import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.xuandong.ChatApp.dto.response.FollowResponse;
import com.xuandong.ChatApp.service.follow.FollowService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("api/v1/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final UserRepository userRepository;

    @GetMapping("/check-follow")
    public boolean checkFollowing(@RequestParam("id") String userId) {
        return followService.isFollowing(userId);
    }

    @PostMapping("/follow")
    public boolean follow(@RequestParam("id") String userId) {
        return followService.handleFollow(userId);
    }

    @GetMapping("/get-following")
    public List<FollowResponse> getFollowing() {
    return followService.getFollowing();
    }

    @GetMapping("/get-followers")
    public List<FollowResponse> getFollowers() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email " + email));
        return followService.getFollower(user);
    }

    @DeleteMapping("/delete-follower")
    public void deleteFollow(@RequestParam("id") String userId) {
        followService.deleteFollower(userId);
    }
}


