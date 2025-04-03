package com.propertymanagement.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.propertymanagement.service.CloudinaryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    
    private static final Logger logger = LoggerFactory.getLogger(CloudinaryServiceImpl.class);
    private static final Pattern PUBLIC_ID_PATTERN = Pattern.compile("/v\\d+/([^/]+/[^.]+)");
    
    @Value("${cloudinary.cloud-name}")
    private String cloudName;
    
    @Value("${cloudinary.api-key}")
    private String apiKey;
    
    @Value("${cloudinary.api-secret}")
    private String apiSecret;
    
    private Cloudinary cloudinary;
    
    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }
    
    @Override
    public String uploadImage(String base64Image, String folder) {
        try {
            if (base64Image == null || base64Image.isEmpty()) {
                logger.warn("Base64 image data is null or empty");
                return null;
            }
            
            String imageData = base64Image;
            // Remove the "data:image/jpeg;base64," part if present
            if (imageData.contains(",")) {
                logger.debug("Base64 image contains data URL prefix, removing it");
                imageData = imageData.substring(imageData.indexOf(",") + 1);
            }
            
            logger.debug("Preparing to upload image to Cloudinary, folder: {}", folder);
            logger.debug("Base64 image length: {}", imageData.length());
            
            try {
                logger.debug("Attempting to upload image using primary method");
                // Try direct upload with raw data
                Map<String, Object> params = ObjectUtils.asMap(
                        "folder", folder != null ? folder : "users",
                        "resource_type", "auto"
                );
                
                Map uploadResult = cloudinary.uploader().upload(imageData, params);
                String secureUrl = (String) uploadResult.get("secure_url");
                
                logger.debug("Image uploaded successfully to Cloudinary: {}", secureUrl);
                return secureUrl;
            } catch (Exception e) {
                logger.error("Error during cloudinary upload with first method", e);
                
                // Try second approach with data URI
                logger.debug("Attempting second upload method");
                try {
                    Map<String, Object> params = ObjectUtils.asMap(
                            "folder", folder != null ? folder : "users",
                            "resource_type", "image"
                    );
                    
                    Map uploadResult = cloudinary.uploader().upload(
                            "data:image/jpeg;base64," + imageData, 
                            params
                    );
                    String secureUrl = (String) uploadResult.get("secure_url");
                    
                    logger.debug("Image uploaded successfully with second method: {}", secureUrl);
                    return secureUrl;
                } catch (Exception e2) {
                    logger.error("Error with second upload method", e2);
                    
                    // Try third approach - converting to bytes
                    try {
                        byte[] imageBytes = java.util.Base64.getDecoder().decode(imageData);
                        
                        Map<String, Object> params = ObjectUtils.asMap(
                                "folder", folder != null ? folder : "users",
                                "resource_type", "auto"
                        );
                        
                        Map uploadResult = cloudinary.uploader().upload(imageBytes, params);
                        String secureUrl = (String) uploadResult.get("secure_url");
                        
                        logger.debug("Image uploaded successfully with third method: {}", secureUrl);
                        return secureUrl;
                    } catch (Exception e3) {
                        logger.error("All upload methods failed", e3);
                        return null;
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error uploading image to Cloudinary", e);
            return null;
        }
    }
    
    @Override
    public boolean deleteImage(String publicId) {
        try {
            if (publicId == null || publicId.isEmpty()) {
                return false;
            }
            
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String status = (String) result.get("result");
            
            logger.debug("Deleted image from Cloudinary with status: {}", status);
            return "ok".equals(status);
            
        } catch (IOException e) {
            logger.error("Error deleting image from Cloudinary", e);
            return false;
        }
    }
    
    @Override
    public String getPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        
        // Extract public ID from URL using regex
        Matcher matcher = PUBLIC_ID_PATTERN.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        
        return null;
    }
} 