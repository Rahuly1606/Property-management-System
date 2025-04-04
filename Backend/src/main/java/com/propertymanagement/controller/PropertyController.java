package com.propertymanagement.controller;

import com.propertymanagement.dto.PropertyDTO;
import com.propertymanagement.mapper.PropertyMapper;
import com.propertymanagement.model.Property;
import com.propertymanagement.model.PropertyType;
import com.propertymanagement.model.User;
import com.propertymanagement.service.PropertyService;
import com.propertymanagement.service.UserService;
import com.propertymanagement.service.CloudinaryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.io.IOException;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    
    private final PropertyService propertyService;
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final PropertyMapper mapper;
    
    public PropertyController(PropertyService propertyService, PropertyMapper propertyMapper, 
                             UserService userService, CloudinaryService cloudinaryService) {
        this.propertyService = propertyService;
        this.mapper = propertyMapper;
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
    }
    
    @GetMapping
    public Page<PropertyDTO> findAll(Pageable pageable) {
        return propertyService.findAll(pageable).map(mapper::toDTO);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        Property property = propertyService.findById(id);
        return ResponseEntity.ok(mapper.toDTO(property));
    }
    
    @PostMapping("/create")
    @PreAuthorize("hasRole('LANDLORD')")
    public PropertyDTO createProperty(@RequestBody PropertyDTO propertyDTO) {
        User currentUser = userService.getCurrentUser();
        Property property = mapper.toEntity(propertyDTO);
        return mapper.toDTO(propertyService.createProperty(property, currentUser));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<PropertyDTO> updateProperty(@PathVariable Long id, @RequestBody PropertyDTO propertyDTO) {
        if (!propertyService.isPropertyOwnedBy(id, userService.getCurrentUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Property property = mapper.toEntity(propertyDTO);
        property.setId(id);
        return ResponseEntity.ok(mapper.toDTO(propertyService.updateProperty(id, property)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        if (!propertyService.isPropertyOwnedBy(id, userService.getCurrentUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> uploadPropertyImages(
            @PathVariable Long id,
            @RequestParam("images") List<MultipartFile> images) {
        
        if (!propertyService.isPropertyOwnedBy(id, userService.getCurrentUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Property property = propertyService.findById(id);
        List<String> uploadedImageUrls = new ArrayList<>();
        
        try {
            // Limit to max 5 images
            int maxImages = 5;
            int availableSlots = maxImages - (property.getImages() != null ? property.getImages().size() : 0);
            int toUpload = Math.min(availableSlots, images.size());
            
            for (int i = 0; i < toUpload; i++) {
                MultipartFile image = images.get(i);
                String base64Image = "data:" + image.getContentType() + ";base64," + 
                                    java.util.Base64.getEncoder().encodeToString(image.getBytes());
                String imageUrl = cloudinaryService.uploadImage(base64Image, "properties");
                if (imageUrl != null) {
                    uploadedImageUrls.add(imageUrl);
                }
            }
            
            if (!uploadedImageUrls.isEmpty()) {
                // Add new images to existing ones
                List<String> currentImages = property.getImages();
                if (currentImages == null) {
                    currentImages = new ArrayList<>();
                }
                currentImages.addAll(uploadedImageUrls);
                property.setImages(currentImages);
                propertyService.updateProperty(id, property);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageUrls", uploadedImageUrls);
            response.put("message", "Images uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{id}/images/{imageIndex}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> deletePropertyImage(
            @PathVariable Long id,
            @PathVariable int imageIndex) {
        
        if (!propertyService.isPropertyOwnedBy(id, userService.getCurrentUser())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Property property = propertyService.findById(id);
        List<String> images = property.getImages();
        
        if (images == null || images.isEmpty() || imageIndex < 0 || imageIndex >= images.size()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Image not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        String imageUrl = images.get(imageIndex);
        // Delete from Cloudinary if it's a Cloudinary URL
        String publicId = cloudinaryService.getPublicIdFromUrl(imageUrl);
        if (publicId != null) {
            cloudinaryService.deleteImage(publicId);
        }
        
        // Remove from property's image list
        images.remove(imageIndex);
        property.setImages(images);
        propertyService.updateProperty(id, property);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Image deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/available")
    public Page<PropertyDTO> findAllAvailable(Pageable pageable) {
        return propertyService.findAllAvailable(pageable).map(mapper::toDTO);
    }
    
    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public Page<PropertyDTO> findByLandlord(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        return propertyService.findByLandlord(currentUser, pageable).map(mapper::toDTO);
    }
    
    @GetMapping("/search")
    public Page<PropertyDTO> searchProperties(
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) Integer minBedrooms,
            Pageable pageable) {
        return propertyService.searchProperties(propertyType, maxRent, minBedrooms, pageable)
                .map(mapper::toDTO);
    }
    
    @GetMapping("/featured")
    public List<PropertyDTO> findFeaturedProperties() {
        return propertyService.findFeaturedProperties().stream()
                .map(mapper::toDTO)
                .toList();
    }
    
    @PutMapping("/{id}/availability")
    @PreAuthorize("hasRole('LANDLORD')")
    public PropertyDTO togglePropertyAvailability(@PathVariable Long id) {
        if (!propertyService.isPropertyOwnedBy(id, userService.getCurrentUser())) {
            throw new IllegalStateException("Property not owned by current user");
        }
        return mapper.toDTO(propertyService.togglePropertyAvailability(id));
    }
    
    @PutMapping("/{id}/featured")
    @PreAuthorize("hasRole('ADMIN')")
    public PropertyDTO togglePropertyFeatured(@PathVariable Long id) {
        return mapper.toDTO(propertyService.togglePropertyFeatured(id));
    }
    
    @GetMapping("/{id}/available")
    public boolean isPropertyAvailable(@PathVariable Long id) {
        return propertyService.isPropertyAvailable(id);
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('LANDLORD')")
    public PropertyStats getPropertyStats() {
        User currentUser = userService.getCurrentUser();
        return new PropertyStats(
                propertyService.countPropertiesByLandlord(currentUser),
                propertyService.countAvailableProperties()
        );
    }
    
    private record PropertyStats(long totalProperties, long availableProperties) {}
} 