package com.xuandong.ChatApp.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.xuandong.ChatApp.dto.response.notification.NotificationResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SseEmitterManager {
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public SseEmitterManager() {
        this.objectMapper = new ObjectMapper();
        // Đăng ký JavaTimeModule và cấu hình serializer cho LocalDateTime
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(formatter));
        this.objectMapper.registerModule(javaTimeModule);
    }

    public SseEmitter subscribe(String userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userId, emitter);

        // Xóa emitter nếu timeout hoặc client đóng kết nối
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));

        return emitter;
    }

        private void sendSseEvent(String userId, Object notification) {
            SseEmitter emitter = emitters.get(userId);
            if (emitter != null) {
                try {
                    String jsonData = objectMapper.writeValueAsString(notification);
                    emitter.send(SseEmitter.event().name("notification").data(jsonData));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    public void sendFollowNotification(String userId, NotificationResponse notification) {
        sendSseEvent(userId, notification);
    }

    public void sendLikePostNotification(String userId, NotificationResponse notification) {
        sendSseEvent(userId, notification);
    }
}