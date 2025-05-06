import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { propertyPurchaseService } from '../../services/propertyPurchaseService';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const BuyPropertyButton = ({ propertyId, propertyTitle, price }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = async () => {
        try {
            setLoading(true);
            const response = await propertyPurchaseService.createPurchaseRequest(propertyId);
            enqueueSnackbar('Purchase request sent successfully!', { variant: 'success' });
            navigate('/purchase-requests');
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to send purchase request', { variant: 'error' });
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                fullWidth
            >
                Buy Property
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Property Purchase</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to request to purchase {propertyTitle}?
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Purchase Price: ₹{price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Note: Your request will be sent to the landlord for approval. Once approved, you will be able to proceed with the payment.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary" disabled={loading}>
                        {loading ? 'Sending Request...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BuyPropertyButton; 