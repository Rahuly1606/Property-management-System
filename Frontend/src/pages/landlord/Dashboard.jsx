import React, { useState, useEffect } from 'react';
import { FaBuilding, FaMoneyBillWave, FaTools, FaCalendarAlt, FaPlus, FaBug, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { toggleMockDataMode, isMockDataModeEnabled } from '../../utils/mockData';

const LandlordDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    pendingPayments: 0,
    maintenanceRequests: 0,
  });
  const [properties, setProperties] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mockModeEnabled, setMockModeEnabled] = useState(isMockDataModeEnabled());
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const handleToggleMockMode = () => {
    const isEnabled = toggleMockDataMode();
    setMockModeEnabled(isEnabled);
    // Refresh the page to apply mock mode
    window.location.reload();
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        const statsRes = await axios.get('/api/landlord/dashboard/stats');
        setStats(statsRes.data);

        // Fetch properties
        const propertiesRes = await axios.get('/api/landlord/properties');
        setProperties(propertiesRes.data);

        // Fetch recent payments
        const paymentsRes = await axios.get('/api/landlord/payments/recent');
        setRecentPayments(paymentsRes.data);

        // Fetch maintenance requests
        const maintenanceRes = await axios.get('/api/landlord/maintenance/recent');
        setMaintenanceRequests(maintenanceRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link to="/profile" className="btn btn-outline btn-info flex items-center gap-2" title="View or edit your profile">
            <FaUser /> My Profile
          </Link>
          {isDevelopment && (
            <button 
              onClick={handleToggleMockMode} 
              className="debug-btn p-2 border border-dashed rounded-full hover:bg-gray-100"
              title={mockModeEnabled ? "Mock Mode Enabled - Click to disable" : "Mock Mode Disabled - Click to enable"}
            >
              <FaBug className={mockModeEnabled ? "text-green-500" : "text-gray-400"} />
            </button>
          )}
          <Link to="/landlord/properties/add">
            <Button variant="primary" className="flex items-center gap-2">
              <FaPlus /> Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Properties</h2>
              <FaBuilding className="text-primary text-3xl" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.properties}</p>
            <div className="card-actions justify-end mt-2">
              <Link to="/landlord/properties" className="text-primary text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-green-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Tenants</h2>
              <FaCalendarAlt className="text-secondary text-3xl" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.tenants}</p>
            <div className="card-actions justify-end mt-2">
              <Link to="/landlord/tenants" className="text-secondary text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-yellow-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Pending Payments</h2>
              <FaMoneyBillWave className="text-accent text-3xl" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.pendingPayments}</p>
            <div className="card-actions justify-end mt-2">
              <Link to="/landlord/payments" className="text-accent text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-red-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Maintenance Requests</h2>
              <FaTools className="text-error text-3xl" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.maintenanceRequests}</p>
            <div className="card-actions justify-end mt-2">
              <Link to="/landlord/maintenance" className="text-error text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Properties List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">My Properties</h2>
            {properties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Address</th>
                      <th>Units</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample data - would be replaced with actual API data */}
                    <tr>
                      <td>Maple Apartments</td>
                      <td>123 Maple St, City</td>
                      <td>8</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                    <tr>
                      <td>Sunset Villas</td>
                      <td>456 Sunset Blvd, City</td>
                      <td>6</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                    <tr>
                      <td>Urban Heights</td>
                      <td>789 Urban Ave, City</td>
                      <td>12</td>
                      <td><span className="badge badge-warning">Pending</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="mb-4">You haven't added any properties yet.</p>
                <Link to="/landlord/properties/add">
                  <Button variant="primary">Add Your First Property</Button>
                </Link>
              </div>
            )}
            {properties.length > 0 && (
              <div className="card-actions justify-end">
                <Link to="/landlord/properties" className="btn btn-primary btn-sm">
                  View All Properties
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Payments</h2>
            {recentPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Tenant</th>
                      <th>Property</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample data - would be replaced with actual API data */}
                    <tr>
                      <td>John Smith</td>
                      <td>Maple Apt #101</td>
                      <td>$1,200</td>
                      <td><span className="badge badge-success">Paid</span></td>
                    </tr>
                    <tr>
                      <td>Mary Johnson</td>
                      <td>Maple Apt #203</td>
                      <td>$1,150</td>
                      <td><span className="badge badge-success">Paid</span></td>
                    </tr>
                    <tr>
                      <td>Robert Davis</td>
                      <td>Sunset Villa #3B</td>
                      <td>$1,500</td>
                      <td><span className="badge badge-warning">Pending</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-8">No recent payment records found.</p>
            )}
            {recentPayments.length > 0 && (
              <div className="card-actions justify-end">
                <Link to="/landlord/payments" className="btn btn-primary btn-sm">
                  View All Payments
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance Requests */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Maintenance Requests</h2>
          {maintenanceRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample data - would be replaced with actual API data */}
                  <tr>
                    <td>#12345</td>
                    <td>Maple Apt #101</td>
                    <td>John Smith</td>
                    <td>Leaking faucet</td>
                    <td><span className="badge badge-warning">Medium</span></td>
                    <td><span className="badge badge-info">In Progress</span></td>
                    <td>2 days ago</td>
                  </tr>
                  <tr>
                    <td>#12346</td>
                    <td>Sunset Villa #3B</td>
                    <td>Robert Davis</td>
                    <td>AC not working</td>
                    <td><span className="badge badge-error">High</span></td>
                    <td><span className="badge badge-warning">Pending</span></td>
                    <td>1 day ago</td>
                  </tr>
                  <tr>
                    <td>#12347</td>
                    <td>Maple Apt #203</td>
                    <td>Mary Johnson</td>
                    <td>Light bulb replacement</td>
                    <td><span className="badge badge-success">Low</span></td>
                    <td><span className="badge badge-success">Completed</span></td>
                    <td>1 week ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8">No maintenance requests at this time.</p>
          )}
          {maintenanceRequests.length > 0 && (
            <div className="card-actions justify-end">
              <Link to="/landlord/maintenance" className="btn btn-primary btn-sm">
                View All Requests
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard; 