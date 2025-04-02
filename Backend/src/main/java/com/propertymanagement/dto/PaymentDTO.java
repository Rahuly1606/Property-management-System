package com.propertymanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private Long leaseId;
    private LeaseDTO lease;
    private UserDTO tenant;
    private Long propertyId;
    private PropertyDTO property;
    private String transactionId;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String status;
    private String receiptUrl;
    private LocalDateTime createdAt;
} 