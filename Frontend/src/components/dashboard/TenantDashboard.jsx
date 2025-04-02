import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  ArrowForward as ArrowForwardIcon,
  AttachMoney as AttachMoneyIcon,
  EventNote as EventNoteIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';

import propertyService from '../../services/propertyService';
import leaseService from '../../services/leaseService';
import paymentService from '../../services/paymentService';
import maintenanceService from '../../services/maintenanceService';

const MaintenanceStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'error';
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'PENDING_APPROVAL':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Chip 
      size="small" 
      label={status.replace('_', ' ')} 
      color={getStatusColor(status)}
      sx={{ fontWeight: 500 }}
    />
  );
};

const TenantDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeLeases, setActiveLeases] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [landlordInfo, setLandlordInfo] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch active leases
      const leaseResponse = await leaseService.getTenantLeases();
      setActiveLeases(leaseResponse.data || []);
      
      // If there's an active lease, fetch the landlord info
      if (leaseResponse.data && leaseResponse.data.length > 0) {
        const landlordId = leaseResponse.data[0].landlordId;
        // This would typically be a call to get landlord details
        // const landlordResponse = await userService.getUserById(landlordId);
        // setLandlordInfo(landlordResponse.data);
      }
      
      // Fetch upcoming payments (based on lease)
      const upcomingPaymentsResponse = await paymentService.getUpcomingPaymentsForTenant();
      setUpcomingPayments(upcomingPaymentsResponse.data || []);
      
      // Fetch recent payments
      const recentPaymentsResponse = await paymentService.getTenantPayments();
      setRecentPayments(recentPaymentsResponse.data?.slice(0, 5) || []);
      
      // Fetch maintenance requests
      const maintenanceResponse = await maintenanceService.getTenantMaintenanceRequests();
      setMaintenanceRequests(maintenanceResponse.data || []);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard information. Please try again later.');
      
      // Sample data for development
      setActiveLeases([
        {
          id: '1',
          propertyId: '1',
          propertyName: 'Sunset Apartments',
          propertyAddress: '123 Main Street, Apt 4B, New York, NY 10001',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          rentAmount: 1500,
          paymentDueDay: 1,
          status: 'ACTIVE',
          landlordId: '5'
        }
      ]);
      
      setLandlordInfo({
        id: '5',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '555-987-6543'
      });
      
      setUpcomingPayments([
        {
          id: '1',
          dueDate: '2023-08-01',
          amount: 1500,
          description: 'August Rent',
          status: 'PENDING',
          leaseId: '1'
        }
      ]);
      
      setRecentPayments([
        {
          id: '5',
          paymentDate: '2023-07-01',
          amount: 1500,
          description: 'July Rent',
          status: 'COMPLETED',
          leaseId: '1'
        },
        {
          id: '4',
          paymentDate: '2023-06-01',
          amount: 1500,
          description: 'June Rent',
          status: 'COMPLETED',
          leaseId: '1'
        },
        {
          id: '3',
          paymentDate: '2023-05-01',
          amount: 1500,
          description: 'May Rent',
          status: 'COMPLETED',
          leaseId: '1'
        }
      ]);
      
      setMaintenanceRequests([
        {
          id: '1',
          title: 'Leaking Faucet',
          description: 'The kitchen faucet is dripping constantly.',
          status: 'IN_PROGRESS',
          createdAt: '2023-07-15T10:30:00Z',
          updatedAt: '2023-07-16T14:45:00Z',
          propertyId: '1'
        },
        {
          id: '2',
          title: 'Broken AC',
          description: 'The air conditioner is not cooling properly.',
          status: 'OPEN',
          createdAt: '2023-07-20T09:15:00Z',
          updatedAt: '2023-07-20T09:15:00Z',
          propertyId: '1'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate days until next payment
  const getNextPaymentDueDate = () => {
    if (upcomingPayments.length > 0) {
      return new Date(upcomingPayments[0].dueDate);
    }
    
    if (activeLeases.length > 0) {
      const lease = activeLeases[0];
      const today = new Date();
      const paymentDueDay = lease.paymentDueDay || 1;
      
      let nextDueDate = new Date(today.getFullYear(), today.getMonth(), paymentDueDay);
      
      // If we've passed this month's due date, move to next month
      if (today.getDate() > paymentDueDay) {
        nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, paymentDueDay);
      }
      
      return nextDueDate;
    }
    
    return null;
  };
  
  const getDaysUntilPayment = () => {
    const nextDueDate = getNextPaymentDueDate();
    if (nextDueDate) {
      return differenceInDays(nextDueDate, new Date());
    }
    return null;
  };
  
  const getLease = () => {
    return activeLeases.length > 0 ? activeLeases[0] : null;
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  const lease = getLease();
  const daysUntilPayment = getDaysUntilPayment();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        {/* Welcome Message */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Welcome to Your Tenant Dashboard
            </Typography>
            <Typography variant="body1">
              Manage your leases, payments, and maintenance requests all in one place.
            </Typography>
          </Paper>
        </Grid>
        
        {/* Quick Stat Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <HomeIcon />
                </Avatar>
                <Typography variant="h6">
                  Your Residence
                </Typography>
              </Box>
              {lease ? (
                <>
                  <Typography variant="body1" color="text.primary">
                    {lease.propertyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {lease.propertyAddress}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Lease Period:</strong> {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  You don't have any active leases.
                </Typography>
              )}
            </CardContent>
            {lease && (
              <CardActions>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(`/leases/${lease.id}`)}
                >
                  View Lease Details
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                  <PaymentIcon />
                </Avatar>
                <Typography variant="h6">
                  Next Payment
                </Typography>
              </Box>
              {lease ? (
                <>
                  <Typography variant="h5" color="primary.main">
                    {formatCurrency(lease.rentAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due on the {lease.paymentDueDay || 1}<sup>st</sup> of each month
                  </Typography>
                  {daysUntilPayment !== null && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: 2,
                      p: 1,
                      bgcolor: daysUntilPayment < 5 ? 'error.light' : 'info.light',
                      borderRadius: 1
                    }}>
                      <CalendarTodayIcon sx={{ mr: 1, color: daysUntilPayment < 5 ? 'error.main' : 'info.main' }} />
                      <Typography variant="body2" color="text.primary">
                        {daysUntilPayment <= 0 
                          ? 'Payment is due today!' 
                          : `${daysUntilPayment} day${daysUntilPayment !== 1 ? 's' : ''} until next payment`}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No upcoming payments.
                </Typography>
              )}
            </CardContent>
            {lease && (
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  variant="contained"
                  endIcon={<AttachMoneyIcon />}
                  onClick={() => navigate(`/payments/make/${lease.id}`)}
                >
                  Make a Payment
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                  <BuildIcon />
                </Avatar>
                <Typography variant="h6">
                  Maintenance Requests
                </Typography>
              </Box>
              <Typography variant="h5" color="text.primary">
                {maintenanceRequests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {maintenanceRequests.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length} active requests
              </Typography>
              
              {maintenanceRequests.some(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS') && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 1,
                  p: 1,
                  bgcolor: 'warning.light',
                  borderRadius: 1
                }}>
                  <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="body2" color="text.primary">
                    You have pending maintenance issues
                  </Typography>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/maintenance')}
              >
                View All Requests
              </Button>
              <Button 
                size="small" 
                color="primary"
                endIcon={<BuildIcon />}
                onClick={() => navigate('/maintenance/new')}
              >
                New Request
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Maintenance Requests */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Recent Maintenance Requests
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/maintenance')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {maintenanceRequests.length > 0 ? (
              <List sx={{ width: '100%' }}>
                {maintenanceRequests.slice(0, 3).map((request) => (
                  <ListItem 
                    key={request.id} 
                    alignItems="flex-start"
                    sx={{ 
                      px: 2, 
                      py: 1.5,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                      borderRadius: 1,
                      mb: 1
                    }}
                    button
                    onClick={() => navigate(`/maintenance/${request.id}`)}
                  >
                    <ListItemIcon>
                      <BuildIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={request.title}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {request.description.length > 60 
                              ? `${request.description.substring(0, 60)}...` 
                              : request.description}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            Submitted on {formatDate(request.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                      <MaintenanceStatusBadge status={request.status} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No maintenance requests found.
              </Typography>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<BuildIcon />}
                onClick={() => navigate('/maintenance/new')}
              >
                Create New Request
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Payment History */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Recent Payments
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/payments')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recentPayments.length > 0 ? (
              <List sx={{ width: '100%' }}>
                {recentPayments.slice(0, 3).map((payment) => (
                  <ListItem 
                    key={payment.id} 
                    alignItems="flex-start"
                    sx={{ 
                      px: 2, 
                      py: 1.5,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                      borderRadius: 1,
                      mb: 1
                    }}
                    button
                    onClick={() => navigate(`/payments/${payment.id}`)}
                  >
                    <ListItemIcon>
                      <ReceiptIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={payment.description}
                      secondary={
                        <>
                          <Typography component="span" variant="caption" color="text.secondary">
                            Paid on {formatDate(payment.paymentDate)}
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No payment history found.
              </Typography>
            )}
            
            {lease && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<PaymentIcon />}
                  onClick={() => navigate(`/payments/make/${lease.id}`)}
                >
                  Make a Payment
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Landlord Contact Card */}
        {landlordInfo && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Landlord
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {landlordInfo.firstName.charAt(0)}{landlordInfo.lastName.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">
                    {landlordInfo.firstName} {landlordInfo.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {landlordInfo.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {landlordInfo.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    startIcon={<AssignmentIcon />}
                    onClick={() => navigate('/messages')}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default TenantDashboard; 