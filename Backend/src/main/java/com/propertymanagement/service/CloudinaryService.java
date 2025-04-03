package com.propertymanagement.service;

public interface CloudinaryService {
    
    /**
     * Upload an image to Cloudinary
     * 
     * @param base64Image The base64 encoded image data
     * @param folder Optional folder to store the image in
     * @return The public URL of the uploaded image
     */
    String uploadImage(String base64Image, String folder);
    
    /**
     * Delete an image from Cloudinary
     * 
     * @param publicId The public ID of the image to delete
     * @return True if delete was successful, false otherwise
     */
    boolean deleteImage(String publicId);
    
    /**
     * Extract the public ID from a Cloudinary URL
     * 
     * @param url The Cloudinary URL
     * @return The public ID
     */
    String getPublicIdFromUrl(String url);
} 