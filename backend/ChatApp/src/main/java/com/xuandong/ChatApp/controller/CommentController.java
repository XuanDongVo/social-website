package com.xuandong.ChatApp.controller;

import com.xuandong.ChatApp.dto.request.CommentRequestDTO;
import com.xuandong.ChatApp.dto.response.CommentResponse;
import com.xuandong.ChatApp.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public void addComment(@RequestBody CommentRequestDTO requestDTO) {
      commentService.addComment(requestDTO);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable String postId , @RequestParam(value = "page" , defaultValue = "0") int page ) {
        List<CommentResponse> comments = commentService.getCommentInPost(postId,page);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteComment(@PathVariable("id") String commentId) {
        commentService.deleteComment(commentId);
    }
}
