package com.propertymanagement.controller;

import com.propertymanagement.dto.PaymentDTO;
import com.propertymanagement.dto.PaymentMethodDTO;
import com.propertymanagement.dto.NewCardDTO;
import com.propertymanagement.mapper.PaymentMapper;
import com.propertymanagement.model.Payment;
import com.propertymanagement.model.User;
import com.propertymanagement.service.PaymentService;
import com.propertymanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentMapper paymentMapper;

    // Get all payments (admin)
    @GetMapping("/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PaymentDTO> getAllPayments(Pageable pageable) {
        return paymentService.findAll(pageable)
                .map(paymentMapper::toDTO);
    }

    // Get payments by property (landlord)
    @GetMapping("/payments/property/{propertyId}")
    @PreAuthorize("hasRole('LANDLORD')")
    public Page<PaymentDTO> getPaymentsByProperty(
            @PathVariable Long propertyId, Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        return paymentService.findByPropertyId(propertyId, currentUser, pageable)
                .map(paymentMapper::toDTO);
    }

    // Get payments for landlord
    @GetMapping("/landlord/payments")
    @PreAuthorize("hasRole('LANDLORD')")
    public Page<PaymentDTO> getLandlordPayments(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        return paymentService.findByLandlord(currentUser, pageable)
                .map(paymentMapper::toDTO);
    }

    // Get payments for tenant
    @GetMapping("/tenant/payments")
    @PreAuthorize("hasRole('TENANT')")
    public Page<PaymentDTO> getTenantPayments(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        return paymentService.findByTenant(currentUser, pageable)
                .map(paymentMapper::toDTO);
    }

    // Get payment by ID
    @GetMapping("/payments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LANDLORD', 'TENANT')")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        User currentUser = userService.getCurrentUser();
        Payment payment = paymentService.findById(id);
        
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Verify access rights
        if (!paymentService.canAccess(payment, currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(paymentMapper.toDTO(payment));
    }

    // Get upcoming payments for tenant
    @GetMapping("/tenant/payments/upcoming")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<PaymentDTO>> getUpcomingPaymentsForTenant() {
        User currentUser = userService.getCurrentUser();
        List<Payment> payments = paymentService.findUpcomingPaymentsByTenant(currentUser);
        List<PaymentDTO> paymentDTOs = payments.stream()
                .map(paymentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(paymentDTOs);
    }

    // Make a payment (tenant)
    @PostMapping("/tenant/payments")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<PaymentDTO> makePayment(@RequestBody MakePaymentDTO paymentDTO) {
        User currentUser = userService.getCurrentUser();
        
        Payment payment;
        if (paymentDTO.getPaymentMethodId() != null) {
            // Use existing payment method
            payment = paymentService.makePayment(
                    paymentDTO.getAmount(),
                    paymentDTO.getDescription(),
                    paymentDTO.getLeaseId(),
                    paymentDTO.getPaymentMethodId(),
                    currentUser);
        } else if (paymentDTO.getNewCard() != null) {
            // Use new card
            payment = paymentService.makePaymentWithNewCard(
                    paymentDTO.getAmount(),
                    paymentDTO.getDescription(),
                    paymentDTO.getLeaseId(),
                    paymentDTO.getNewCard(),
                    paymentDTO.isSaveCard(),
                    currentUser);
        } else {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMapper.toDTO(payment));
    }

    // Record a payment (landlord)
    @PostMapping("/landlord/payments/record")
    @PreAuthorize("hasAnyRole('ADMIN', 'LANDLORD')")
    public ResponseEntity<PaymentDTO> recordPayment(@RequestBody RecordPaymentDTO paymentDTO) {
        User currentUser = userService.getCurrentUser();
        
        Payment payment = paymentService.recordPayment(
                paymentDTO.getAmount(),
                paymentDTO.getDescription(),
                paymentDTO.getLeaseId(),
                paymentDTO.getPaymentMethod(),
                paymentDTO.getPaymentDate(),
                currentUser);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMapper.toDTO(payment));
    }

    // Get payment receipt
    @GetMapping("/payments/{paymentId}/receipt")
    @PreAuthorize("hasAnyRole('ADMIN', 'LANDLORD', 'TENANT')")
    public ResponseEntity<Resource> getPaymentReceipt(@PathVariable Long paymentId) {
        User currentUser = userService.getCurrentUser();
        Payment payment = paymentService.findById(paymentId);
        
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Verify access rights
        if (!paymentService.canAccess(payment, currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Resource receipt = paymentService.generateReceipt(paymentId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"payment-receipt-" + paymentId + ".pdf\"")
                .body(receipt);
    }

    // Get payment statistics for landlord
    @GetMapping("/landlord/payments/stats")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> getLandlordPaymentStats() {
        User currentUser = userService.getCurrentUser();
        Map<String, Object> stats = paymentService.getPaymentStatsByLandlord(currentUser);
        return ResponseEntity.ok(stats);
    }

    // Get recent payments (for dashboard)
    @GetMapping("/payments/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'LANDLORD')")
    public ResponseEntity<List<PaymentDTO>> getRecentPayments(
            @RequestParam(defaultValue = "5") int limit) {
        User currentUser = userService.getCurrentUser();
        List<Payment> payments;
        
        if (userService.hasRole(currentUser, "ADMIN")) {
            payments = paymentService.findRecentPayments(limit);
        } else {
            payments = paymentService.findRecentPaymentsByLandlord(currentUser, limit);
        }

        List<PaymentDTO> paymentDTOs = payments.stream()
                .map(paymentMapper::toDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(paymentDTOs);
    }

    // Generate payment invoice
    @PostMapping("/leases/{leaseId}/invoices")
    @PreAuthorize("hasAnyRole('ADMIN', 'LANDLORD')")
    public ResponseEntity<PaymentDTO> generatePaymentInvoice(
            @PathVariable Long leaseId, @RequestBody InvoiceDTO invoiceDTO) {
        User currentUser = userService.getCurrentUser();
        
        Payment invoice = paymentService.generateInvoice(
                leaseId,
                invoiceDTO.getAmount(),
                invoiceDTO.getDescription(),
                invoiceDTO.getDueDate(),
                currentUser);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMapper.toDTO(invoice));
    }

    // Get payment methods for tenant
    @GetMapping("/tenant/payment-methods")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<PaymentMethodDTO>> getTenantPaymentMethods() {
        User currentUser = userService.getCurrentUser();
        List<PaymentMethodDTO> paymentMethods = paymentService.findPaymentMethodsByUser(currentUser);
        return ResponseEntity.ok(paymentMethods);
    }

    // Add payment method for tenant
    @PostMapping("/tenant/payment-methods")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<PaymentMethodDTO> addTenantPaymentMethod(
            @RequestBody PaymentMethodDTO paymentMethodDTO) {
        User currentUser = userService.getCurrentUser();
        
        PaymentMethodDTO savedMethod = paymentService.addPaymentMethod(paymentMethodDTO, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMethod);
    }

    // Remove payment method
    @DeleteMapping("/tenant/payment-methods/{paymentMethodId}")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Void> removeTenantPaymentMethod(@PathVariable Long paymentMethodId) {
        User currentUser = userService.getCurrentUser();
        
        boolean result = paymentService.removePaymentMethod(paymentMethodId, currentUser);
        
        if (result) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Set default payment method
    @PutMapping("/tenant/payment-methods/{paymentMethodId}/default")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<PaymentMethodDTO> setDefaultPaymentMethod(@PathVariable Long paymentMethodId) {
        User currentUser = userService.getCurrentUser();
        
        PaymentMethodDTO updatedMethod = paymentService.setDefaultPaymentMethod(paymentMethodId, currentUser);
        
        if (updatedMethod != null) {
            return ResponseEntity.ok(updatedMethod);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DTOs for request handling
    static class MakePaymentDTO {
        private java.math.BigDecimal amount;
        private String description;
        private Long leaseId;
        private Long paymentMethodId;
        private NewCardDTO newCard;
        private boolean saveCard = true;
        
        public java.math.BigDecimal getAmount() {
            return amount;
        }
        
        public void setAmount(java.math.BigDecimal amount) {
            this.amount = amount;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public Long getLeaseId() {
            return leaseId;
        }
        
        public void setLeaseId(Long leaseId) {
            this.leaseId = leaseId;
        }
        
        public Long getPaymentMethodId() {
            return paymentMethodId;
        }
        
        public void setPaymentMethodId(Long paymentMethodId) {
            this.paymentMethodId = paymentMethodId;
        }
        
        public NewCardDTO getNewCard() {
            return newCard;
        }
        
        public void setNewCard(NewCardDTO newCard) {
            this.newCard = newCard;
        }
        
        public boolean isSaveCard() {
            return saveCard;
        }
        
        public void setSaveCard(boolean saveCard) {
            this.saveCard = saveCard;
        }
    }
    
    static class RecordPaymentDTO {
        private java.math.BigDecimal amount;
        private String description;
        private Long leaseId;
        private String paymentMethod;
        private java.time.LocalDate paymentDate;
        
        public java.math.BigDecimal getAmount() {
            return amount;
        }
        
        public void setAmount(java.math.BigDecimal amount) {
            this.amount = amount;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public Long getLeaseId() {
            return leaseId;
        }
        
        public void setLeaseId(Long leaseId) {
            this.leaseId = leaseId;
        }
        
        public String getPaymentMethod() {
            return paymentMethod;
        }
        
        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
        
        public java.time.LocalDate getPaymentDate() {
            return paymentDate;
        }
        
        public void setPaymentDate(java.time.LocalDate paymentDate) {
            this.paymentDate = paymentDate;
        }
    }
    
    static class InvoiceDTO {
        private java.math.BigDecimal amount;
        private String description;
        private java.time.LocalDate dueDate;
        
        public java.math.BigDecimal getAmount() {
            return amount;
        }
        
        public void setAmount(java.math.BigDecimal amount) {
            this.amount = amount;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public java.time.LocalDate getDueDate() {
            return dueDate;
        }
        
        public void setDueDate(java.time.LocalDate dueDate) {
            this.dueDate = dueDate;
        }
    }
} 