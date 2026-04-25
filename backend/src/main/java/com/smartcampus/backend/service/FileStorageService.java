package com.smartcampus.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads/tickets}")
    private String uploadDir;

    public String saveFile(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Attachment file is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image attachments are allowed");
        }

        File directory = new File(uploadDir);
        if (!directory.exists() && !directory.mkdirs()) {
            throw new IllegalStateException("Could not create upload directory");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID() + "_" + originalName;
        Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(uniqueFileName);

        Files.write(filePath, file.getBytes());
        return filePath.toString();
    }

    public Resource loadFileAsResource(String filePath) throws Exception {
        Path path = Paths.get(filePath).toAbsolutePath().normalize();
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new IllegalArgumentException("Attachment file not found");
        }
        return resource;
    }
}
