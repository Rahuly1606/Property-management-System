package com.propertymanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "maintenance_requests")
public class MaintenanceRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 1000)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime resolvedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceRequestStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceRequestPriority priority;
    
    @Column(nullable = false)
    private String category;
    
    @ElementCollection
    @CollectionTable(name = "maintenance_request_images")
    private List<String> images = new ArrayList<>();
    
    private String assignedTo;
    
    private String contactPhone;
    
    private BigDecimal estimatedCost;
    
    private BigDecimal actualCost;
    
    private String notes;
    
    @OneToMany(mappedBy = "maintenanceRequest", cascade = CascadeType.ALL)
    private List<MaintenanceRequestComment> comments = new ArrayList<>();
    
    private String permitRequired;
    
    private String permitStatus;
    
    private String permitNumber;
    
    @Column(nullable = false)
    private boolean emergencyRequest;
    
    private String emergencyContacts;
    
    private LocalDateTime scheduledDate;
    
    private String scheduledTimeSlot;
    
    private String preferredTimeSlot;
    
    private String resolution;
    
    private String additionalNotes;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = MaintenanceRequestStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 