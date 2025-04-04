package com.propertymanagement.controller;

import com.propertymanagement.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Base64;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    
    private final CloudinaryService cloudinaryService;
    
    @Autowired
    public ImageController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestBody Map<String, String> request) {
        String imageData = request.get("imageData");
        
        if (imageData == null || imageData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No image data provided"));
        }
        
        String imageUrl = cloudinaryService.uploadImage(imageData, "properties");
        
        if (imageUrl != null) {
            Map<String, String> response = new HashMap<>();
            response.put("secureUrl", imageUrl);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image"));
        }
    }
    
    @PostMapping("/upload-file")
    public ResponseEntity<Map<String, Object>> uploadImageFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
        }
        
        try {
            // Convert MultipartFile to base64
            String base64Image = "data:" + file.getContentType() + ";base64," + 
                                Base64.getEncoder().encodeToString(file.getBytes());
                                
            String imageUrl = cloudinaryService.uploadImage(base64Image, "properties");
            
            if (imageUrl != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("secureUrl", imageUrl);
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to upload image", "success", false));
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process image: " + e.getMessage(), "success", false));
        }
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteImage(@RequestParam String imageUrl) {
        String publicId = cloudinaryService.getPublicIdFromUrl(imageUrl);
        
        if (publicId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid image URL"));
        }
        
        boolean deleted = cloudinaryService.deleteImage(publicId);
        
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Image deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Failed to delete image"));
        }
    }
} 