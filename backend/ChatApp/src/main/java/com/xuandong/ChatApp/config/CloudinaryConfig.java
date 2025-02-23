package com.xuandong.ChatApp.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {

	@Bean
	public Cloudinary configKey() {
		Map<String, String> config = new HashMap<>();
		config.put("cloud_name", "ddqre1ndq");
		config.put("api_key", "232253493552488");
		config.put("api_secret", "TlHL7uLgaQIDiizfNmeTolGfzjE");
		return new Cloudinary(config);
	}
}
