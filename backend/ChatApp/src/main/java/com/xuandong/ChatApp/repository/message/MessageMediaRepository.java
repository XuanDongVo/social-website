package com.xuandong.ChatApp.repository.message;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.MessageMedia;

public interface MessageMediaRepository extends JpaRepository<MessageMedia, String> {

}
