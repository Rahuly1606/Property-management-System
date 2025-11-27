import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaFileContract, FaMoneyBillWave, FaTools, FaExclamationTriangle, FaPlus, FaUser, FaRupeeSign } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import './Dashboard.css';
import maintenanceService from '../../services/maintenanceService';
import Loading from '../../components/common/Loading';
import { DashboardCardSkeleton } from '../../components/common/SkeletonLoader';

const TenantDashboard = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [leaseInfo, setLeaseInfo] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [upcomingPayment, setUpcomingPayment] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // In a real app, these would be actual API calls
        // For demo purposes, we're simulating API responses

        // Simulate lease information
        const leaseData = {
          property: 'Maple Apartments #101',
          address: '123 Maple Street, Cityville, State 12345',
          landlord: 'John Smith',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          monthlyRent: 1200,
          securityDeposit: 1200,
          status: 'Active'
        };
        setLeaseInfo(leaseData);

        // Simulate recent payments
        const paymentsData = [
          { id: 1, date: '2023-03-01', amount: 1200, status: 'Paid', method: 'Credit Card' },
          { id: 2, date: '2023-02-01', amount: 1200, status: 'Paid', method: 'Bank Transfer' },
          { id: 3, date: '2023-01-01', amount: 1200, status: 'Paid', method: 'Credit Card' }
        ];
        setRecentPayments(paymentsData);

        // Simulate upcoming payment
        const upcomingPaymentData = {
          dueDate: '2023-04-01',
          amount: 1200,
          status: 'Pending'
        };
        setUpcomingPayment(upcomingPaymentData);

        // Fetch actual maintenance requests
        try {
          const maintenanceData = await maintenanceService.getTenantMaintenanceRequests();
          if (Array.isArray(maintenanceData)) {
            setMaintenanceRequests(maintenanceData.slice(0, 3)); // Show only the 3 most recent
          } else if (maintenanceData && maintenanceData.content && Array.isArray(maintenanceData.content)) {
            setMaintenanceRequests(maintenanceData.content.slice(0, 3));
          } else {
            console.error('Unexpected maintenance data format:', maintenanceData);
            setMaintenanceRequests([]);
          }
        } catch (error) {
          console.error('Error fetching maintenance requests:', error);
          // Fallback to sample data if API fails
          const sampleMaintenanceData = [
            {
              id: 1,
              title: 'Leaking faucet in bathroom',
              status: 'IN_PROGRESS',
              priority: 'MEDIUM',
              createdAt: '2023-03-15',
              description: 'The bathroom sink faucet is leaking constantly.'
            },
            {
              id: 2,
              title: 'Broken air conditioning',
              status: 'COMPLETED',
              priority: 'HIGH',
              createdAt: '2023-02-20',
              description: 'AC unit is not cooling properly.'
            }
          ];
          setMaintenanceRequests(sampleMaintenanceData);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <motion.div
      className="tenant-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="dashboard-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <h1>Tenant Dashboard</h1>
          <p>Welcome back, {currentUser?.firstName || 'Tenant'}!</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/profile" className="btn btn-outline mr-2">
            <FaUser /> My Profile
          </Link>
          <Link to="/tenant/maintenance/new" className="btn btn-primary">
            <FaPlus /> New Maintenance Request
          </Link>
        </div>
      </motion.div>

      {/* Current Lease Summary */}
      <motion.div
        className="card lease-summary-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="card-header">
          <h2 className="card-title">Current Lease</h2>
        </div>
        <div className="card-body">
          {isLoading ? (
            <DashboardCardSkeleton />
          ) : leaseInfo ? (
            <div className="lease-info">
              <div className="lease-property">
                <h3>{leaseInfo.property}</h3>
                <p>{leaseInfo.address}</p>
              </div>
              <div className="lease-details">
                <div className="lease-detail">
                  <span className="detail-label">Landlord:</span>
                  <span className="detail-value">{leaseInfo.landlord}</span>
                </div>
                <div className="lease-detail">
                  <span className="detail-label">Lease Period:</span>
                  <span className="detail-value">
                    {new Date(leaseInfo.startDate).toLocaleDateString()} to {new Date(leaseInfo.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="lease-detail">
                  <span className="detail-label">Monthly Rent:</span>
                  <span className="detail-value">₹{leaseInfo.monthlyRent}</span>
                </div>
                <div className="lease-detail">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value status-active">{leaseInfo.status}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-lease">
              <p>You don't have any active leases.</p>
              <Link to="/properties" className="btn btn-primary">Browse Properties</Link>
            </div>
          )}
        </div>
        {leaseInfo && (
          <div className="card-footer">
            <Link to="/tenant/lease" className="btn btn-outline">View Full Lease Details</Link>
          </div>
        )}
      </motion.div>

      {/* Payment Summary */}
      <div className="dashboard-row">
        <motion.div
          className="card payment-card"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="card-header">
            <h2 className="card-title">Payment Information</h2>
          </div>
          <div className="card-body">
            {isLoading ? (
              <DashboardCardSkeleton />
            ) : (
              <>
                {upcomingPayment && (
                  <div className="upcoming-payment">
                    <h3>Upcoming Payment</h3>
                    <div className="payment-amount">₹{upcomingPayment.amount}</div>
                    <div className="payment-due">
                      Due on {new Date(upcomingPayment.dueDate).toLocaleDateString()}
                    </div>
                    <Link to="/tenant/payments/make-payment" className="btn btn-primary mt-3">
                      Make Payment
                    </Link>
                  </div>
                )}

                <div className="payment-history">
                  <h3>Recent Payments</h3>
                  {recentPayments.length > 0 ? (
                    <table className="payment-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPayments.map(payment => (
                          <tr key={payment.id}>
                            <td>{new Date(payment.date).toLocaleDateString()}</td>
                            <td>₹{payment.amount}</td>
                            <td>
                              <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                                {payment.status}
                              </span>
                            </td>
                            <td>{payment.method}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No payment history available.</p>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="card-footer">
            <Link to="/tenant/payments" className="btn btn-outline">View All Payments</Link>
          </div>
        </motion.div>

        {/* Maintenance Requests */}
        <motion.div
          className="card maintenance-card"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="card-header">
            <h2 className="card-title">Maintenance Requests</h2>
          </div>
          <div className="card-body">
            {isLoading ? (
              <DashboardCardSkeleton />
            ) : maintenanceRequests.length > 0 ? (
              <div className="maintenance-list">
                {maintenanceRequests.map(request => (
                  <div key={request.id} className="maintenance-item">
                    <div className="maintenance-header">
                      <h3>{request.title}</h3>
                      <span className={`status-badge status-${request.status?.toLowerCase().replace('_', '-')}`}>
                        {request.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="maintenance-details">
                      <div className="maintenance-detail">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="maintenance-detail">
                        <span className="detail-label">Priority:</span>
                        <span className={`detail-value priority-${request.priority?.toLowerCase()}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                    {request.description && (
                      <div className="maintenance-notes">
                        <p>{request.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-maintenance">
                <p>No maintenance requests found.</p>
              </div>
            )}
          </div>
          <div className="card-footer">
            <Link to="/tenant/maintenance" className="btn btn-outline">View All Requests</Link>
            <Link to="/tenant/maintenance/new" className="btn btn-primary">
              <FaPlus className="icon-left" /> New Request
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div
        className="quick-links"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2>Quick Links</h2>
        <div className="links-grid">
          {[
            { to: "/tenant/lease", icon: FaFileContract, label: "View Lease", delay: 0.7 },
            { to: "/tenant/payments", icon: FaMoneyBillWave, label: "Payment History", delay: 0.75 },
            { to: "/tenant/maintenance", icon: FaTools, label: "Maintenance", delay: 0.8 },
            { to: "/messages", icon: FaExclamationTriangle, label: "Contact Landlord", delay: 0.85 }
          ].map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: link.delay, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={link.to} className="quick-link-card">
                <link.icon className="quick-link-icon" />
                <span>{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TenantDashboard; 