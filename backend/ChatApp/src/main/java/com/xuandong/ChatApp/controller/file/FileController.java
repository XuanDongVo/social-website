package com.xuandong.ChatApp.controller.file;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.xuandong.ChatApp.service.file.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
public class FileController {
	private final FileService fileService;

	@PostMapping("/upload-file")
	public ResponseEntity<?> uploadFile(@RequestParam("files") List<MultipartFile> files) {
		List<String> urlImages = new ArrayList<>();

		files.forEach(file -> {
			try {
				String urlPath = fileService.uploadImageToCloudinary(file);
				urlImages.add(urlPath);
			} catch (IOException e) {
				throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Email đã tồn tại!");
			}

		});
		return ResponseEntity.ok(urlImages);
	}
}
