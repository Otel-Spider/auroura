import React from 'react';
import { Form, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { router } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';
import { refreshCSRFToken } from '../../utils/csrf';

const Topbar = ({ onToggleSidebar, auth }) => {
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // Refresh CSRF token before logout
      await refreshCSRFToken();
      console.log('CSRF token refreshed for logout');
    } catch (error) {
      console.error('Failed to refresh CSRF token for logout:', error);
    }

    // Perform logout with fresh token
    router.post('/logout');
  };

  return (
    <Navbar className="topbar">
      <div className="d-flex align-items-center w-100">
        {/* Mobile Menu Button */}
        <button
          className="p-0 btn btn-link d-lg-none me-3"
          onClick={onToggleSidebar}
          style={{ color: 'var(--muted)', border: 'none' }}
        >
          <RiIcons.RiMenuLine size={24} />
        </button>

        {/* Search Bar */}
        <Form.Control
          type="search"
          placeholder="Search..."
          className="topbar-search form-control-sm me-auto"
        />

        {/* Right Side Icons */}
        <Nav className="ms-auto align-items-center">
          {/* Language Flags Dropdown */}
          <Nav.Item className="me-2">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="p-0 text-decoration-none d-flex align-items-center"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <img
                  src="https://flagcdn.com/24x18/gb.png"
                  alt="UK Flag"
                  style={{
                    width: '24px',
                    height: '18px',
                    objectFit: 'cover',
                    borderRadius: '2px'
                  }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="border-0 shadow"
                style={{
                  background: 'rgb(0 0 0 / 20%)',
                  border: '1px solid var(--line)',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow)',
                  padding: '0.5rem 0'
                }}
              >
                <Dropdown.Item
                  href="#"
                  style={{ color: 'var(--text)' }}
                  className="d-flex align-items-center"
                >
                  <img
                    src="https://flagcdn.com/20x15/gb.png"
                    alt="UK Flag"
                    style={{
                      width: '20px',
                      height: '15px',
                      objectFit: 'cover',
                      borderRadius: '2px',
                      marginRight: '8px'
                    }}
                  />
                  English
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  style={{ color: 'var(--text)' }}
                  className="d-flex align-items-center"
                >
                  <img
                    src="https://flagcdn.com/20x15/es.png"
                    alt="Spain Flag"
                    style={{
                      width: '20px',
                      height: '15px',
                      objectFit: 'cover',
                      borderRadius: '2px',
                      marginRight: '8px'
                    }}
                  />
                  Español
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  style={{ color: 'var(--text)' }}
                  className="d-flex align-items-center"
                >
                  <img
                    src="https://flagcdn.com/20x15/fr.png"
                    alt="France Flag"
                    style={{
                      width: '20px',
                      height: '15px',
                      objectFit: 'cover',
                      borderRadius: '2px',
                      marginRight: '8px'
                    }}
                  />
                  Français
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>

          {/* Notifications Dropdown */}
          <Nav.Item className="me-2">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="p-0 text-decoration-none d-flex align-items-center"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <RiIcons.RiNotificationBadgeLine className="topbar-icon" size={35} />
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="border-0 shadow"
                align="end"
                style={{
                  background: 'rgb(0 0 0 / 20%)',
                  border: '1px solid var(--line)',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow)',
                  padding: '0.5rem 0',
                  minWidth: '300px'
                }}
              >
                <div className="px-3 py-2 border-bottom" style={{ borderColor: 'var(--line)' }}>
                  <h6 className="mb-0 text-white">Notifications</h6>
                </div>

                <Dropdown.Item
                  href="#"
                  style={{ color: 'var(--text)' }}
                  className="p-3 d-flex align-items-start"
                >
                  <div className="me-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--chip)',
                        color: 'var(--text)'
                      }}
                    >
                      <RiIcons.RiUserLine size={16} />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold small">New User Registration</div>
                        <div className="text-muted small">John Doe has registered for an account</div>
                      </div>
                      <small className="text-muted">2m ago</small>
                    </div>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  href="#"
                  style={{ color: 'var(--text)' }}
                  className="p-3 d-flex align-items-start"
                >
                  <div className="me-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--chip)',
                        color: 'var(--text)'
                      }}
                    >
                      <RiIcons.RiShoppingCartLine size={16} />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold small">New Order Received</div>
                        <div className="text-muted small">Order #12345 has been placed</div>
                      </div>
                      <small className="text-muted">5m ago</small>
                    </div>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  href="#"
                  style={{ color: 'var(--text)' }}
                  className="p-3 d-flex align-items-start"
                >
                  <div className="me-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--chip)',
                        color: 'var(--text)'
                      }}
                    >
                      <RiIcons.RiMessageLine size={16} />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold small">New Message</div>
                        <div className="text-muted small">You have a new message from Sarah</div>
                      </div>
                      <small className="text-muted">10m ago</small>
                    </div>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  href="#"
                  style={{ color: 'var(--text)' }}
                  className="p-3 d-flex align-items-start"
                >
                  <div className="me-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--chip)',
                        color: 'var(--text)'
                      }}
                    >
                      <RiIcons.RiAlertLine size={16} />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold small">System Alert</div>
                        <div className="text-muted small">Server maintenance scheduled for tonight</div>
                      </div>
                      <small className="text-muted">1h ago</small>
                    </div>
                  </div>
                </Dropdown.Item>

                <div className="px-3 py-2 border-top" style={{ borderColor: 'var(--line)' }}>
                  <a href="#" className="text-center text-decoration-none d-block">
                    <small className="text-muted">View all notifications</small>
                  </a>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>

          {/* User Profile Dropdown */}
          <Nav.Item>
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="p-0 d-flex align-items-center text-decoration-none topbar-icon"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div className="d-flex align-items-center">
                  <span className="d-none d-md-inline me-2" style={{ fontSize: '0.875rem' }}>
                    {auth?.user?.name || 'User'}
                  </span>
                  <RiIcons.RiUserLine size={20} />
                </div>
              </Dropdown.Toggle>

            <Dropdown.Menu
              className="border-0 shadow"
              style={{
                background: 'rgb(0 0 0 / 20%)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                boxShadow: 'var(--shadow)'
              }}
            >
              <Dropdown.Item
                href="#"
                style={{ color: 'var(--text)' }}
                className="d-flex align-items-center"
              >
                <RiIcons.RiUserLine className="me-2" size={18} />
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                style={{ color: 'var(--text)' }}
                className="d-flex align-items-center"
              >
                <RiIcons.RiSettings3Line className="me-2" size={18} />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider style={{ borderColor: 'var(--line)' }} />
              <Dropdown.Item
                href="#"
                onClick={handleLogout}
                style={{ color: 'var(--danger)' }}
                className="d-flex align-items-center"
              >
                <RiIcons.RiLogoutBoxLine className="me-2" size={18} />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>
        </Nav>
      </div>
    </Navbar>
  );
};

export default Topbar;
