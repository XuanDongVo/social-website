package com.xuandong.ChatApp.service.redis;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.service.follow.FollowService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {
    private static final int NEWSFEED_LIMIT = 12;
    private final RedisTemplate<String, String> redisTemplate;
    private final FollowService followService;
    
    public void pushPostToFollowers(User user, String postId) {
        Set<String> followers = followService.getFollower(user).stream()
                .map(follow -> follow.getFollow().getId())
                .collect(Collectors.toSet());

        long timestamp = System.currentTimeMillis(); 

        for (String followerId : followers) {
            String feedKey = "newsfeed:" + followerId;
            redisTemplate.opsForZSet().add(feedKey, postId, timestamp); 
        }
    }

    
    public void removePostFromFeed(String userId, String postId) {
        String feedKey = "newsfeed:" + userId;
        redisTemplate.opsForZSet().remove(feedKey, postId);
    }
    


    public List<String> getNewsfeed(String userId, int page) {
        String feedKey = "newsfeed:" + userId;
        
        int start = page * NEWSFEED_LIMIT;
        int end = start + NEWSFEED_LIMIT - 1;

        Set<String> posts = redisTemplate.opsForZSet().reverseRange(feedKey, start, end);
        
        return posts == null ? Collections.emptyList() : new ArrayList<>(posts);
    }



    
    
}
