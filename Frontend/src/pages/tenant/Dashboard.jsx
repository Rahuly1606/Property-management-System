import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFileContract, FaMoneyBillWave, FaTools, FaExclamationTriangle, FaPlus, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import './Dashboard.css';

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
        
        // Simulate maintenance requests
        const maintenanceData = [
          { 
            id: 1, 
            issue: 'Leaking faucet in bathroom', 
            status: 'In Progress', 
            priority: 'Medium',
            date: '2023-03-15',
            notes: 'Plumber scheduled for tomorrow'
          },
          { 
            id: 2, 
            issue: 'Broken air conditioning', 
            status: 'Completed', 
            priority: 'High',
            date: '2023-02-20',
            notes: 'Fixed on Feb 22'
          }
        ];
        setMaintenanceRequests(maintenanceData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="tenant-dashboard">
      <div className="dashboard-header">
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
      </div>

      {/* Current Lease Summary */}
      <div className="card lease-summary-card">
        <div className="card-header">
          <h2 className="card-title">Current Lease</h2>
        </div>
        <div className="card-body">
          {leaseInfo ? (
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
                  <span className="detail-value">${leaseInfo.monthlyRent}</span>
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
      </div>

      {/* Payment Summary */}
      <div className="dashboard-row">
        <div className="card payment-card">
          <div className="card-header">
            <h2 className="card-title">Payment Information</h2>
          </div>
          <div className="card-body">
            {upcomingPayment && (
              <div className="upcoming-payment">
                <h3>Upcoming Payment</h3>
                <div className="payment-amount">${upcomingPayment.amount}</div>
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
                        <td>${payment.amount}</td>
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
          </div>
          <div className="card-footer">
            <Link to="/tenant/payments" className="btn btn-outline">View All Payments</Link>
          </div>
        </div>
        
        {/* Maintenance Requests */}
        <div className="card maintenance-card">
          <div className="card-header">
            <h2 className="card-title">Maintenance Requests</h2>
          </div>
          <div className="card-body">
            {maintenanceRequests.length > 0 ? (
              <div className="maintenance-list">
                {maintenanceRequests.map(request => (
                  <div key={request.id} className="maintenance-item">
                    <div className="maintenance-header">
                      <h3>{request.issue}</h3>
                      <span className={`status-badge status-${request.status.toLowerCase().replace(' ', '-')}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="maintenance-details">
                      <div className="maintenance-detail">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{new Date(request.date).toLocaleDateString()}</span>
                      </div>
                      <div className="maintenance-detail">
                        <span className="detail-label">Priority:</span>
                        <span className={`detail-value priority-${request.priority.toLowerCase()}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                    {request.notes && (
                      <div className="maintenance-notes">
                        <p>{request.notes}</p>
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
            <div className="footer-actions">
              <Link to="/tenant/maintenance/new" className="btn btn-primary">
                <FaPlus /> New Request
              </Link>
              <Link to="/tenant/maintenance" className="btn btn-outline">
                View All Requests
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-grid">
          <Link to="/tenant/lease" className="quick-link-card">
            <FaFileContract className="quick-link-icon" />
            <span>View Lease</span>
          </Link>
          <Link to="/tenant/payments" className="quick-link-card">
            <FaMoneyBillWave className="quick-link-icon" />
            <span>Payment History</span>
          </Link>
          <Link to="/tenant/maintenance" className="quick-link-card">
            <FaTools className="quick-link-icon" />
            <span>Maintenance</span>
          </Link>
          <Link to="/messages" className="quick-link-card">
            <FaExclamationTriangle className="quick-link-icon" />
            <span>Contact Landlord</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard; 