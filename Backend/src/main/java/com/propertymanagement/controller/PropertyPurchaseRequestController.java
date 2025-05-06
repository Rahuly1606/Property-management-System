package com.propertymanagement.controller;

import com.propertymanagement.dto.PropertyPurchaseRequestDTO;
import com.propertymanagement.mapper.PropertyPurchaseRequestMapper;
import com.propertymanagement.model.PropertyPurchaseRequest;
import com.propertymanagement.model.PurchaseRequestStatus;
import com.propertymanagement.model.User;
import com.propertymanagement.service.PropertyPurchaseRequestService;
import com.propertymanagement.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/property-purchase-requests")
public class PropertyPurchaseRequestController {

    private final PropertyPurchaseRequestService purchaseRequestService;
    private final UserService userService;
    private final PropertyPurchaseRequestMapper mapper;

    public PropertyPurchaseRequestController(PropertyPurchaseRequestService purchaseRequestService,
                                           UserService userService,
                                           PropertyPurchaseRequestMapper mapper) {
        this.purchaseRequestService = purchaseRequestService;
        this.userService = userService;
        this.mapper = mapper;
    }

    @PostMapping("/{propertyId}")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<PropertyPurchaseRequestDTO> createPurchaseRequest(@PathVariable Long propertyId) {
        User currentUser = userService.getCurrentUser();
        PropertyPurchaseRequest request = purchaseRequestService.createPurchaseRequest(propertyId, currentUser);
        return ResponseEntity.ok(mapper.toDTO(request));
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<PropertyPurchaseRequestDTO> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> request) {
        
        PurchaseRequestStatus status = PurchaseRequestStatus.valueOf(request.get("status"));
        String responseNotes = request.get("responseNotes");
        
        PropertyPurchaseRequest updatedRequest = purchaseRequestService.updateRequestStatus(requestId, status, responseNotes);
        return ResponseEntity.ok(mapper.toDTO(updatedRequest));
    }

    @PostMapping("/{requestId}/initiate-payment")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<PropertyPurchaseRequestDTO> initiatePayment(@PathVariable Long requestId) {
        PropertyPurchaseRequest request = purchaseRequestService.initiatePayment(requestId);
        return ResponseEntity.ok(mapper.toDTO(request));
    }

    @PostMapping("/{requestId}/process-payment")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<PropertyPurchaseRequestDTO> processPayment(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> paymentDetails) {
        
        String razorpayPaymentId = paymentDetails.get("razorpayPaymentId");
        String razorpaySignature = paymentDetails.get("razorpaySignature");
        
        PropertyPurchaseRequest request = purchaseRequestService.processPayment(requestId, razorpayPaymentId, razorpaySignature);
        return ResponseEntity.ok(mapper.toDTO(request));
    }

    @PostMapping("/{requestId}/cancel")
    @PreAuthorize("hasAnyRole('TENANT', 'LANDLORD')")
    public ResponseEntity<PropertyPurchaseRequestDTO> cancelRequest(@PathVariable Long requestId) {
        PropertyPurchaseRequest request = purchaseRequestService.cancelRequest(requestId);
        return ResponseEntity.ok(mapper.toDTO(request));
    }

    @GetMapping("/tenant")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<PropertyPurchaseRequestDTO>> getTenantRequests() {
        User currentUser = userService.getCurrentUser();
        List<PropertyPurchaseRequest> requests = purchaseRequestService.getTenantRequests(currentUser);
        return ResponseEntity.ok(requests.stream().map(mapper::toDTO).toList());
    }

    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<List<PropertyPurchaseRequestDTO>> getLandlordRequests() {
        User currentUser = userService.getCurrentUser();
        List<PropertyPurchaseRequest> requests = purchaseRequestService.getLandlordRequests(currentUser);
        return ResponseEntity.ok(requests.stream().map(mapper::toDTO).toList());
    }

    @GetMapping("/tenant/paged")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Page<PropertyPurchaseRequestDTO>> getTenantRequestsPaged(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        Page<PropertyPurchaseRequest> requests = purchaseRequestService.getTenantRequests(currentUser, pageable);
        return ResponseEntity.ok(requests.map(mapper::toDTO));
    }

    @GetMapping("/landlord/paged")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Page<PropertyPurchaseRequestDTO>> getLandlordRequestsPaged(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        Page<PropertyPurchaseRequest> requests = purchaseRequestService.getLandlordRequests(currentUser, pageable);
        return ResponseEntity.ok(requests.map(mapper::toDTO));
    }
} 