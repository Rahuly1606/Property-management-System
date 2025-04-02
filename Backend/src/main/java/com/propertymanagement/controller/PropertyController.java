package com.propertymanagement.controller;

import com.propertymanagement.controller.base.impl.BaseControllerImpl;
import com.propertymanagement.dto.PropertyDTO;
import com.propertymanagement.mapper.PropertyMapper;
import com.propertymanagement.model.Property;
import com.propertymanagement.model.PropertyType;
import com.propertymanagement.model.User;
import com.propertymanagement.model.base.BaseEntity;
import com.propertymanagement.service.PropertyService;
import com.propertymanagement.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController extends BaseControllerImpl<Property, PropertyDTO, PropertyService, PropertyMapper> {
    
    private final PropertyService propertyService;
    private final UserService userService;
    
    public PropertyController(PropertyService propertyService, PropertyMapper propertyMapper, UserService userService) {
        super(propertyService, propertyMapper);
        this.propertyService = propertyService;
        this.userService = userService;
    }
    
    @Override
    @PostMapping
    public ResponseEntity<Property> create(@RequestBody Property entity) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
    
    @PostMapping("/create")
    @PreAuthorize("hasRole('LANDLORD')")
    public PropertyDTO createProperty(@RequestBody PropertyDTO propertyDTO) {
        User currentUser = userService.getCurrentUser();
        Property property = mapper.toEntity(propertyDTO);
        return mapper.toDTO(propertyService.createProperty(property, currentUser));
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