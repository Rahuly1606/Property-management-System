package com.propertymanagement.dto;

import com.propertymanagement.dto.base.BaseDTO;
import com.propertymanagement.model.PaymentStatus;
import com.propertymanagement.model.PurchaseRequestStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class PropertyPurchaseRequestDTO extends BaseDTO {
    
    private Long propertyId;
    private String propertyTitle;
    private Long tenantId;
    private String tenantName;
    private Long landlordId;
    private String landlordName;
    private LocalDateTime requestDate;
    private PurchaseRequestStatus status;
    private LocalDateTime responseDate;
    private String responseNotes;
    private BigDecimal purchasePrice;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private String invoiceUrl;
} 