package com.propertymanagement.service.impl;

import com.propertymanagement.dto.auth.RegisterRequest;
import com.propertymanagement.exception.ResourceNotFoundException;
import com.propertymanagement.model.User;
import com.propertymanagement.model.UserRole;
import com.propertymanagement.repository.UserRepository;
import com.propertymanagement.service.UserService;
import com.propertymanagement.service.base.impl.BaseServiceImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl extends BaseServiceImpl<User, UserRepository> implements UserService {

    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder) {
        super(repository);
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.TENANT);
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setActive(true);
        
        // Let the AuditorAware handle these values automatically
        // Don't set them manually to avoid conflicts
        
        return repository.save(user);
    }

    @Override
    @Transactional
    public User updateUser(Long id, User user) {
        User existingUser = findById(id);
        
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setProfileImage(user.getProfileImage());
        
        return repository.save(existingUser);
    }

    @Override
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public List<User> findByRole(UserRole role) {
        return repository.findByRole(role);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public User updateUserProfile(Long id, String firstName, String lastName, String phoneNumber, String profileImage) {
        User user = findById(id);
        
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
        if (profileImage != null) user.setProfileImage(profileImage);
        
        return repository.save(user);
    }

    @Override
    @Transactional
    public User changeUserPassword(Long id, String currentPassword, String newPassword) {
        User user = findById(id);
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        return repository.save(user);
    }

    @Override
    @Transactional
    public User toggleUserStatus(Long id) {
        User user = findById(id);
        user.setActive(!user.isActive());
        return repository.save(user);
    }

    @Override
    public boolean hasRole(User user, String role) {
        if (user == null || role == null) {
            return false;
        }
        return user.getRole() != null && user.getRole().name().equals(role);
    }
} 