package com.propertymanagement.service.impl;

import com.propertymanagement.exception.ResourceNotFoundException;
import com.propertymanagement.model.*;
import com.propertymanagement.repository.PropertyPurchaseRequestRepository;
import com.propertymanagement.service.PropertyPurchaseRequestService;
import com.propertymanagement.service.PropertyService;
import com.propertymanagement.service.UserService;
import com.propertymanagement.service.base.impl.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PropertyPurchaseRequestServiceImpl extends BaseServiceImpl<PropertyPurchaseRequest, PropertyPurchaseRequestRepository> implements PropertyPurchaseRequestService {

    private final PropertyService propertyService;
    private final UserService userService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PropertyPurchaseRequestServiceImpl(PropertyPurchaseRequestRepository repository,
                                            PropertyService propertyService,
                                            UserService userService) {
        super(repository);
        this.propertyService = propertyService;
        this.userService = userService;
    }

    @Override
    @Transactional
    public PropertyPurchaseRequest createPurchaseRequest(Long propertyId, User tenant) {
        Property property = propertyService.findById(propertyId);
        
        if (!property.isAvailable()) {
            throw new IllegalStateException("Property is not available for purchase");
        }
        
        PropertyPurchaseRequest request = new PropertyPurchaseRequest();
        request.setProperty(property);
        request.setTenant(tenant);
        request.setLandlord(property.getLandlord());
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(PurchaseRequestStatus.PENDING);
        request.setPurchasePrice(property.getMonthlyRent().multiply(new java.math.BigDecimal("12"))); // Example: 12 months rent
        
        return repository.save(request);
    }

    @Override
    @Transactional
    public PropertyPurchaseRequest updateRequestStatus(Long requestId, PurchaseRequestStatus status, String responseNotes) {
        PropertyPurchaseRequest request = findById(requestId);
        
        if (request.getStatus() != PurchaseRequestStatus.PENDING) {
            throw new IllegalStateException("Can only update status of pending requests");
        }
        
        request.setStatus(status);
        request.setResponseDate(LocalDateTime.now());
        request.setResponseNotes(responseNotes);
        
        return repository.save(request);
    }

    @Override
    @Transactional
    public PropertyPurchaseRequest initiatePayment(Long requestId) {
        PropertyPurchaseRequest request = findById(requestId);
        
        if (request.getStatus() != PurchaseRequestStatus.APPROVED) {
            throw new IllegalStateException("Can only initiate payment for approved requests");
        }
        
        // TODO: Implement Razorpay order creation
        // This is where you would integrate with Razorpay API to create an order
        // For now, we'll just update the status
        request.setStatus(PurchaseRequestStatus.PAYMENT_PENDING);
        
        return repository.save(request);
    }

    @Override
    @Transactional
    public PropertyPurchaseRequest processPayment(Long requestId, String razorpayPaymentId, String razorpaySignature) {
        PropertyPurchaseRequest request = findById(requestId);
        
        if (request.getStatus() != PurchaseRequestStatus.PAYMENT_PENDING) {
            throw new IllegalStateException("Can only process payment for payment pending requests");
        }
        
        // TODO: Implement Razorpay payment verification
        // This is where you would verify the payment with Razorpay
        // For now, we'll just update the status
        request.setStatus(PurchaseRequestStatus.PAYMENT_COMPLETED);
        request.setPaymentStatus(PaymentStatus.COMPLETED);
        request.setPaymentDate(LocalDateTime.now());
        request.setRazorpayPaymentId(razorpayPaymentId);
        request.setRazorpaySignature(razorpaySignature);
        
        // Update property status
        Property property = request.getProperty();
        property.setAvailable(false);
        propertyService.updateProperty(property.getId(), property);
        
        return repository.save(request);
    }

    @Override
    @Transactional
    public PropertyPurchaseRequest cancelRequest(Long requestId) {
        PropertyPurchaseRequest request = findById(requestId);
        
        if (request.getStatus() == PurchaseRequestStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed payment");
        }
        
        request.setStatus(PurchaseRequestStatus.CANCELLED);
        
        return repository.save(request);
    }

    @Override
    public List<PropertyPurchaseRequest> getTenantRequests(User tenant) {
        return repository.findByTenant(tenant);
    }

    @Override
    public List<PropertyPurchaseRequest> getLandlordRequests(User landlord) {
        return repository.findByLandlord(landlord);
    }

    @Override
    public Page<PropertyPurchaseRequest> getTenantRequests(User tenant, Pageable pageable) {
        return repository.findByTenant(tenant, pageable);
    }

    @Override
    public Page<PropertyPurchaseRequest> getLandlordRequests(User landlord, Pageable pageable) {
        return repository.findByLandlord(landlord, pageable);
    }

    @Override
    public boolean isRequestPending(Long requestId) {
        PropertyPurchaseRequest request = findById(requestId);
        return request.getStatus() == PurchaseRequestStatus.PENDING;
    }

    @Override
    public boolean isRequestApproved(Long requestId) {
        PropertyPurchaseRequest request = findById(requestId);
        return request.getStatus() == PurchaseRequestStatus.APPROVED;
    }

    @Override
    public boolean isRequestRejected(Long requestId) {
        PropertyPurchaseRequest request = findById(requestId);
        return request.getStatus() == PurchaseRequestStatus.REJECTED;
    }

    @Override
    public boolean isRequestCancelled(Long requestId) {
        PropertyPurchaseRequest request = findById(requestId);
        return request.getStatus() == PurchaseRequestStatus.CANCELLED;
    }

    @Override
    public boolean isPaymentCompleted(Long requestId) {
        PropertyPurchaseRequest request = findById(requestId);
        return request.getStatus() == PurchaseRequestStatus.PAYMENT_COMPLETED;
    }
} 