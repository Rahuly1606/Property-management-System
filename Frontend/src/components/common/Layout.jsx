import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaHome, FaBuilding, FaUser, FaBars, FaTimes, FaSignOutAlt, FaInbox, FaBell } from 'react-icons/fa';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, userRole } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { to: '/', icon: <FaHome />, text: 'Home' },
        { to: '/properties', icon: <FaBuilding />, text: 'Properties' },
        { to: '/login', icon: <FaUser />, text: 'Login' },
        { to: '/register', icon: <FaUser />, text: 'Register' }
      ];
    }

    const roleBasedLinks = {
      ADMIN: [
        { to: '/admin/dashboard', icon: <FaHome />, text: 'Dashboard' },
        { to: '/admin/users', icon: <FaUser />, text: 'Users' },
        { to: '/admin/properties', icon: <FaBuilding />, text: 'Properties' },
        { to: '/admin/reports', icon: <FaBuilding />, text: 'Reports' },
        { to: '/admin/settings', icon: <FaUser />, text: 'Settings' }
      ],
      LANDLORD: [
        { to: '/landlord/dashboard', icon: <FaHome />, text: 'Dashboard' },
        { to: '/landlord/properties', icon: <FaBuilding />, text: 'Properties' },
        { to: '/landlord/leases', icon: <FaBuilding />, text: 'Leases' },
        { to: '/landlord/payments', icon: <FaBuilding />, text: 'Payments' },
        { to: '/landlord/maintenance', icon: <FaBuilding />, text: 'Maintenance' },
        { to: '/landlord/tenants', icon: <FaUser />, text: 'Tenants' },
        { to: '/landlord/settings', icon: <FaUser />, text: 'Settings' }
      ],
      TENANT: [
        { to: '/tenant/dashboard', icon: <FaHome />, text: 'Dashboard' },
        { to: '/tenant/lease', icon: <FaBuilding />, text: 'My Lease' },
        { to: '/tenant/payments', icon: <FaBuilding />, text: 'Payments' },
        { to: '/tenant/maintenance', icon: <FaBuilding />, text: 'Maintenance' },
        { to: '/tenant/settings', icon: <FaUser />, text: 'Settings' }
      ]
    };

    // Common links for all authenticated users
    const commonLinks = [
      { to: '/messages', icon: <FaInbox />, text: 'Messages' },
      { to: '/profile', icon: <FaUser />, text: 'Profile' }
    ];

    return [...(roleBasedLinks[userRole] || []), ...commonLinks];
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="logo">
            Property Management System
          </Link>
        </div>
        <div className="header-right">
          {currentUser && (
            <>
              <Link to="/messages" className="header-icon">
                <FaInbox />
              </Link>
              <Link to="/notifications" className="header-icon">
                <FaBell />
              </Link>
              <div className="user-profile">
                <span>{currentUser.name || currentUser.email}</span>
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          )}
          {!currentUser && (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="main-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <ul>
              {getNavLinks().map((link, index) => (
                <li key={index}>
                  <Link to={link.to} onClick={() => setSidebarOpen(false)}>
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-text">{link.text}</span>
                  </Link>
                </li>
              ))}
              {currentUser && (
                <li className="sidebar-logout">
                  <button onClick={handleLogout}>
                    <span className="nav-icon"><FaSignOutAlt /></span>
                    <span className="nav-text">Logout</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Property Management System</p>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 