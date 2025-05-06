import React, { useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { propertyPurchaseService } from '../../services/propertyPurchaseService';
import { useSnackbar } from 'notistack';

const RazorpayPayment = ({ open, onClose, request }) => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (open && request) {
            initializeRazorpay();
        }
    }, [open, request]);

    const initializeRazorpay = async () => {
        try {
            const response = await propertyPurchaseService.initiatePayment(request.id);
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: response.purchasePrice * 100, // Razorpay expects amount in paise
                currency: "INR",
                name: "Property Management System",
                description: `Purchase of ${request.propertyTitle}`,
                order_id: response.razorpayOrderId,
                handler: async function (response) {
                    try {
                        await propertyPurchaseService.processPayment(
                            request.id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );
                        enqueueSnackbar('Payment successful!', { variant: 'success' });
                        onClose(true); // true indicates successful payment
                    } catch (error) {
                        enqueueSnackbar('Payment verification failed', { variant: 'error' });
                        onClose(false);
                    }
                },
                prefill: {
                    name: request.tenantName,
                    email: request.tenantEmail,
                    contact: request.tenantPhone
                },
                theme: {
                    color: "#1976d2"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            enqueueSnackbar('Failed to initialize payment', { variant: 'error' });
            onClose(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Property: {request?.propertyTitle}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Amount: ₹{request?.purchasePrice}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    You will be redirected to Razorpay's secure payment gateway to complete the transaction.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={initializeRazorpay} color="primary">
                    Proceed to Payment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RazorpayPayment; 