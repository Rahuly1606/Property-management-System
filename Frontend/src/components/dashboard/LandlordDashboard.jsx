import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  CardActionArea,
  Stack,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Description as DocumentIcon,
  Construction as ConstructionIcon,
  Apartment as ApartmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as ClockIcon,
  Build as BuildIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

import leaseService from '../../services/leaseService';
import paymentService from '../../services/paymentService';
import maintenanceService from '../../services/maintenanceService';
import propertyService from '../../services/propertyService';

// Status badges for maintenance requests
const MaintenanceStatusBadge = ({ status }) => {
  const statusColors = {
    NEW: { color: 'warning', icon: <ClockIcon fontSize="small" /> },
    IN_PROGRESS: { color: 'info', icon: <BuildIcon fontSize="small" /> },
    COMPLETED: { color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
    CANCELLED: { color: 'error', icon: <WarningIcon fontSize="small" /> }
  };
  
  const statusConfig = statusColors[status] || statusColors.NEW;
  
  return (
    <Chip
      icon={statusConfig.icon}
      label={status.replace('_', ' ')}
      color={statusConfig.color}
      size="small"
      sx={{ fontWeight: 'medium' }}
    />
  );
};

const LandlordDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [upcomingLeases, setUpcomingLeases] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    thisMonth: 0,
    lastMonth: 0,
    outstanding: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch landlord properties
        const propertiesData = await propertyService.getLandlordProperties();
        setProperties(propertiesData || []);
        
        // Fetch upcoming lease expirations/renewals
        const leasesData = await leaseService.getUpcomingLeaseRenewals();
        setUpcomingLeases(leasesData || []);
        
        // Fetch recent payments
        const paymentsData = await paymentService.getLandlordPayments(5); // Limit to 5 recent payments
        setRecentPayments(paymentsData || []);
        
        // Fetch payment statistics
        const statsData = await paymentService.getLandlordPaymentStats();
        if (statsData) {
          setPaymentStats(statsData);
        }
        
        // Fetch maintenance requests
        const maintenanceData = await maintenanceService.getLandlordMaintenanceRequests();
        setMaintenanceRequests(maintenanceData || []);
        
        // For tenants, we'll combine them from property data
        const allTenants = [];
        if (propertiesData) {
          propertiesData.forEach(property => {
            if (property.leases) {
              property.leases.forEach(lease => {
                if (lease.tenant && lease.status === 'ACTIVE') {
                  allTenants.push({
                    ...lease.tenant,
                    propertyName: property.name || property.address,
                    propertyId: property.id,
                    leaseId: lease.id
                  });
                }
              });
            }
          });
        }
        setTenants(allTenants);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Sample data for development if API calls fail
        setProperties([
          {
            id: 1,
            name: 'Sunset Apartments',
            address: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62704',
            imageUrl: 'https://via.placeholder.com/300x200',
            numberOfUnits: 4,
            occupiedUnits: 3
          },
          {
            id: 2,
            name: 'Mountain View Condos',
            address: '456 Oak Avenue',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62704',
            imageUrl: 'https://via.placeholder.com/300x200',
            numberOfUnits: 2,
            occupiedUnits: 2
          }
        ]);
        
        setTenants([
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '555-123-4567',
            propertyName: 'Sunset Apartments',
            propertyId: 1,
            leaseId: 1
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '555-987-6543',
            propertyName: 'Sunset Apartments',
            propertyId: 1,
            leaseId: 2
          }
        ]);
        
        setUpcomingLeases([
          {
            id: 3,
            property: { name: 'Sunset Apartments', id: 1 },
            tenant: { firstName: 'Robert', lastName: 'Johnson', id: 3 },
            endDate: '2023-07-31',
            monthlyRent: 1100.00
          }
        ]);
        
        setRecentPayments([
          {
            id: 1,
            amount: 1200.00,
            description: 'Monthly Rent',
            tenant: { firstName: 'John', lastName: 'Doe', id: 1 },
            property: { name: 'Sunset Apartments', id: 1 },
            paymentDate: '2023-05-01',
            status: 'COMPLETED'
          },
          {
            id: 2,
            amount: 1100.00,
            description: 'Monthly Rent',
            tenant: { firstName: 'Jane', lastName: 'Smith', id: 2 },
            property: { name: 'Sunset Apartments', id: 1 },
            paymentDate: '2023-05-02',
            status: 'COMPLETED'
          }
        ]);
        
        setPaymentStats({
          thisMonth: 2300.00,
          lastMonth: 2300.00,
          outstanding: 1100.00
        });
        
        setMaintenanceRequests([
          {
            id: 1,
            title: 'Leaking Faucet',
            description: 'The kitchen sink faucet is leaking.',
            property: { name: 'Sunset Apartments', id: 1 },
            tenant: { firstName: 'John', lastName: 'Doe', id: 1 },
            status: 'NEW',
            priority: 'MEDIUM',
            createdAt: '2023-05-10T10:30:00Z'
          },
          {
            id: 2,
            title: 'Broken Light Switch',
            description: 'The light switch in the hallway is not working.',
            property: { name: 'Mountain View Condos', id: 2 },
            tenant: { firstName: 'Jane', lastName: 'Smith', id: 2 },
            status: 'IN_PROGRESS',
            priority: 'LOW',
            createdAt: '2023-05-15T14:45:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Landlord Dashboard
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/landlord/properties/add')}
          startIcon={<ApartmentIcon />}
        >
          Add Property
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Property Stats */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 160,
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              <ApartmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Properties
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography component="p" variant="h3" color="inherit">
                {properties.length}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="inherit" sx={{ mt: 'auto' }}>
              Total properties in your portfolio
            </Typography>
          </Paper>
        </Grid>
        
        {/* Tenant Stats */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 160,
              background: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Tenants
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography component="p" variant="h3" color="inherit">
                {tenants.length}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="inherit" sx={{ mt: 'auto' }}>
              Active tenants across all properties
            </Typography>
          </Paper>
        </Grid>
        
        {/* Payment Stats */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 160,
              background: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Revenue
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography component="p" variant="h3" color="inherit">
                ₹{paymentStats.thisMonth.toFixed(2)}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="inherit" sx={{ mt: 'auto' }}>
              This month's rental income | Outstanding: ₹{paymentStats.outstanding.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Properties List */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mt: 2 }}>
            Your Properties
          </Typography>
          
          <Grid container spacing={2}>
            {properties.length > 0 ? (
              properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea onClick={() => navigate(`/landlord/properties/${property.id}`)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={property.imageUrl || 'https://via.placeholder.com/300x140?text=Property'}
                        alt={property.name || property.address}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {property.name || property.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.address}, {property.city}, {property.state}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            label={`${property.occupiedUnits || 0}/${property.numberOfUnits || 1} Units Occupied`} 
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">
                    You have no properties yet. Add your first property to get started.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/landlord/properties/add')}
                  >
                    Add Property
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
        
        {/* Maintenance Requests */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 320,
              overflow: 'hidden'
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <ConstructionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recent Maintenance Requests
            </Typography>
            
            {maintenanceRequests.length > 0 ? (
              <>
                <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                  {maintenanceRequests.slice(0, 5).map(request => (
                    <ListItem
                      key={request.id}
                      sx={{ py: 1 }}
                      secondaryAction={
                        <MaintenanceStatusBadge status={request.status} />
                      }
                    >
                      <ListItemText
                        primary={request.title}
                        secondary={
                          <>
                            {`${request.tenant?.firstName} ${request.tenant?.lastName} • ${request.property?.name || 'Property'}`}
                            <br />
                            {`${new Date(request.createdAt).toLocaleDateString()}`}
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/landlord/maintenance')}
                  >
                    View All Requests
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography variant="body1" color="text.secondary">
                  No maintenance requests at this time
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Leases Coming Up For Renewal */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 320,
              overflow: 'hidden'
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <DocumentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Leases Coming Up For Renewal
            </Typography>
            
            {upcomingLeases.length > 0 ? (
              <>
                <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                  {upcomingLeases.map(lease => (
                    <ListItem key={lease.id} sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${lease.tenant?.firstName} ${lease.tenant?.lastName}`}
                        secondary={
                          <>
                            {`${lease.property?.name || 'Property'}`}
                            <br />
                            {`Expires: ${new Date(lease.endDate).toLocaleDateString()} • ₹${lease.monthlyRent?.toFixed(2)}/month`}
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => navigate(`/landlord/leases/${lease.id}/renew`)}
                      >
                        Renew
                      </Button>
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/landlord/leases')}
                  >
                    View All Leases
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming lease renewals
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Payments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recent Payments
            </Typography>
            
            {recentPayments.length > 0 ? (
              <>
                <Box sx={{ overflow: 'auto' }}>
                  <List sx={{ width: '100%' }}>
                    {recentPayments.map((payment) => (
                      <ListItem
                        key={payment.id}
                        sx={{ py: 1 }}
                        secondaryAction={
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            ₹{payment.amount.toFixed(2)}
                          </Typography>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {payment.description}
                              </Typography>
                              <Chip 
                                label={payment.status} 
                                color={payment.status === 'COMPLETED' ? 'success' : 'default'} 
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              {`${payment.tenant?.firstName} ${payment.tenant?.lastName} • ${payment.property?.name || 'Property'}`}
                              <br />
                              {`${new Date(payment.paymentDate).toLocaleDateString()}`}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ₹{paymentStats.lastMonth.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/landlord/payments')}
                  >
                    View All Payments
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No payment history available.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandlordDashboard; 