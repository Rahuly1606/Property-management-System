package com.propertymanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "lease_id")
    private Lease lease;
    
    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private User tenant;
    
    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
    
    private String transactionId;
    
    private LocalDate paymentDate;
    
    private String paymentMethod;
    
    @Column(nullable = false)
    private String status;
    
    private String receiptUrl;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (paymentDate == null) {
            paymentDate = LocalDate.now();
        }
    }
} 