package com.propertymanagement.model;

import com.propertymanagement.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "property_purchase_requests")
@EqualsAndHashCode(callSuper = true)
public class PropertyPurchaseRequest extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;
    
    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PurchaseRequestStatus status;
    
    @Column(name = "response_date")
    private LocalDateTime responseDate;
    
    @Column(name = "response_notes", length = 1000)
    private String responseNotes;
    
    @Column(name = "purchase_price", nullable = false)
    private BigDecimal purchasePrice;
    
    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;
    
    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;
    
    @Column(name = "razorpay_signature")
    private String razorpaySignature;
    
    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "invoice_url")
    private String invoiceUrl;
} 