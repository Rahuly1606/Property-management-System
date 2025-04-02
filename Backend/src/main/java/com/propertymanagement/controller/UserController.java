package com.propertymanagement.controller;

import com.propertymanagement.controller.base.impl.BaseControllerImpl;
import com.propertymanagement.dto.UserDTO;
import com.propertymanagement.mapper.UserMapper;
import com.propertymanagement.model.User;
import com.propertymanagement.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseControllerImpl<User, UserDTO, UserService, UserMapper> {
    
    private final UserService userService;
    
    public UserController(UserService userService, UserMapper userMapper) {
        super(userService, userMapper);
        this.userService = userService;
    }
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserDTO getCurrentUser() {
        return mapper.toDTO(userService.getCurrentUser());
    }
    
    @PutMapping("/{id}/profile")
    @PreAuthorize("isAuthenticated()")
    public UserDTO updateProfile(
            @PathVariable Long id,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String profileImage) {
        return mapper.toDTO(userService.updateUserProfile(id, firstName, lastName, phoneNumber, profileImage));
    }
    
    @PutMapping("/{id}/password")
    @PreAuthorize("isAuthenticated()")
    public UserDTO changePassword(
            @PathVariable Long id,
            @RequestParam String currentPassword,
            @RequestParam String newPassword) {
        return mapper.toDTO(userService.changeUserPassword(id, currentPassword, newPassword));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO toggleUserStatus(@PathVariable Long id) {
        return mapper.toDTO(userService.toggleUserStatus(id));
    }
} 