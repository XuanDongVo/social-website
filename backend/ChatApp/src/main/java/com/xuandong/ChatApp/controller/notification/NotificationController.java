package com.xuandong.ChatApp.controller.notification;

import com.xuandong.ChatApp.dto.response.notification.NotificationResponse;
import com.xuandong.ChatApp.mapper.PostMapper;
import com.xuandong.ChatApp.service.notification.NotificationService;
import com.xuandong.ChatApp.utils.SseEmitterManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final SseEmitterManager sseEmitterManager;
    private final PostMapper postMapper;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestParam("id") String userId) {
        return sseEmitterManager.subscribe(userId);
    }


    @GetMapping()
    public List<NotificationResponse> getNotificationOfUser() {
        return notificationService.getNotifcationOfUser();
    }

    @PatchMapping("/read")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void markAsRead() {
        notificationService.markAsRead();
    }
}
