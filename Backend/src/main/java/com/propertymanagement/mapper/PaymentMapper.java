package com.propertymanagement.mapper;

import com.propertymanagement.dto.PaymentDTO;
import com.propertymanagement.model.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PaymentMapper {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private LeaseMapper leaseMapper;

    @Autowired
    private PropertyMapper propertyMapper;

    /**
     * Convert a Payment entity to PaymentDTO
     */
    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentDTO.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .description(payment.getDescription())
                .leaseId(payment.getLease() != null ? payment.getLease().getId() : null)
                .lease(payment.getLease() != null ? leaseMapper.toDTO(payment.getLease()) : null)
                .tenant(payment.getTenant() != null ? userMapper.toDTO(payment.getTenant()) : null)
                .propertyId(payment.getProperty() != null ? payment.getProperty().getId() : null)
                .property(payment.getProperty() != null ? propertyMapper.toDTO(payment.getProperty()) : null)
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate() != null ? payment.getPaymentDate().atStartOfDay() : null)
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .receiptUrl(payment.getReceiptUrl())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    /**
     * Convert a list of Payment entities to a list of PaymentDTOs
     */
    public List<PaymentDTO> toDTOList(List<Payment> payments) {
        if (payments == null) {
            return null;
        }

        return payments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert a PaymentDTO to Payment entity
     */
    public Payment toEntity(PaymentDTO paymentDTO) {
        if (paymentDTO == null) {
            return null;
        }

        Payment payment = new Payment();
        payment.setId(paymentDTO.getId());
        payment.setAmount(paymentDTO.getAmount());
        payment.setDescription(paymentDTO.getDescription());
        payment.setTransactionId(paymentDTO.getTransactionId());
        payment.setPaymentDate(paymentDTO.getPaymentDate() != null ? paymentDTO.getPaymentDate().toLocalDate() : null);
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setStatus(paymentDTO.getStatus());
        payment.setReceiptUrl(paymentDTO.getReceiptUrl());
        payment.setCreatedAt(paymentDTO.getCreatedAt());
        
        // Note: The lease, tenant, and property relationships should be 
        // set by the service layer, not directly by the mapper
        
        return payment;
    }
} 