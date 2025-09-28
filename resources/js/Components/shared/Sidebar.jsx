import React, { useState } from 'react';
import { Nav, Collapse } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const [pagesOpen, setPagesOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Close dropdown when sidebar is collapsed
  React.useEffect(() => {
    if (isCollapsed) {
      setPagesOpen(false);
    }
  }, [isCollapsed]);

  const handlePagesMouseEnter = () => {
    // Open dropdown if sidebar is visible (either manually opened or temporarily expanded via hover)
    if (!isCollapsed || isHovered) {
      setPagesOpen(true);
    }
  };

  const handlePagesMouseLeave = () => {
    setPagesOpen(false);
  };

  const handleMouseEnter = (e) => {
    // Only activate hover when the sidebar is collapsed
    if (isCollapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = (e) => {
    // Only deactivate hover when leaving the sidebar completely
    if (isCollapsed) {
      setIsHovered(false);
    }
  };

  const handleToggleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    onToggle();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="top-0 opacity-50 d-lg-none position-fixed start-0 w-100 h-100 bg-dark"
          style={{ zIndex: 999 }}
          onClick={onToggle}
        />
      )}

      {/* Hover Zone - only visible when sidebar is collapsed */}
      {isCollapsed && (
        <div
          className="sidebar-hover-zone"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '20px',
            height: '100vh',
            zIndex: 999,
            background: 'transparent'
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Toggle Button - positioned above header */}
        <div className={`sidebar-toggle ${isCollapsed && !isHovered ? 'd-none' : ''}`}>
          <button
            className="toggle-btn"
            onClick={handleToggleClick}
            aria-label="Toggle sidebar"
          >
            <RiIcons.RiArrowLeftLine size={20} />
          </button>
        </div>

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="/storage/logo/otel-fav.png"
              alt="Otel Spider"
              className="logo-image"
            />
            <span className="logo-text">Otel Spider</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <Nav className="flex-column">
            {/* Dashboard */}
            <Nav.Item>
              <Link
                href="/dashboard"
                className="nav-link"
                as="div"
              >
                <RiIcons.RiDashboardLine size={20} />
                <span>Dashboard</span>
              </Link>
            </Nav.Item>

            {/* Pages Dropdown */}
            <Nav.Item>
              <div
                className="nav-link dropdown-toggle"
                onMouseEnter={handlePagesMouseEnter}
                onMouseLeave={handlePagesMouseLeave}
                style={{ cursor: 'pointer' }}
              >
                <RiIcons.RiPagesLine size={20} />
                <span>Pages</span>
                <RiIcons.RiArrowDownSLine
                  size={16}
                  className={`ms-auto transition-transform ${pagesOpen ? 'rotate-180' : ''}`}
                  style={{ transition: 'transform 0.2s ease' }}
                />
              </div>
                      <Collapse in={pagesOpen}>
                        <div
                          className="dropdown-menu-items"
                          onMouseEnter={handlePagesMouseEnter}
                          onMouseLeave={handlePagesMouseLeave}
                        >
                          <Link
                            href="/dashboard/home"
                            className="nav-link sub-nav-link"
                            as="div"
                          >
                            <RiIcons.RiHomeLine size={16} />
                            <span>Home</span>
                          </Link>
                        </div>
                      </Collapse>
            </Nav.Item>

            {/* Theme */}
            <Nav.Item>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <RiIcons.RiPaletteLine size={20} />
                <span>Theme</span>
              </div>
            </Nav.Item>

            {/* Media Manager */}
            <Nav.Item style={isCollapsed ? {margin: '0rem 0rem -.8rem'} : {}}>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6, }}>
                <RiIcons.RiImageLine size={isCollapsed ? 24 : 20} />
                <span>Media Manager</span>
              </div>
            </Nav.Item>

            {/* Pop-ups */}
            <Nav.Item>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <RiIcons.RiWindowLine size={20} />
                <span>Pop-ups</span>
              </div>
            </Nav.Item>

            {/* Blog */}
            <Nav.Item>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <RiIcons.RiArticleLine size={20} />
                <span>Blog</span>
              </div>
            </Nav.Item>

            {/* SEO */}
            <Nav.Item>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <RiIcons.RiSearchLine size={20} />
                <span>SEO</span>
              </div>
            </Nav.Item>

            {/* Logs */}
            <Nav.Item>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <RiIcons.RiFileListLine size={20} />
                <span>Logs</span>
              </div>
            </Nav.Item>

            {/* Languages */}
            <Nav.Item>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <RiIcons.RiGlobalLine size={20} />
                <span>Languages</span>
              </div>
            </Nav.Item>

            {/* Website Inquiries */}
            <Nav.Item style={isCollapsed ? {margin: '0rem 0rem -.8rem'} : {}}>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6, }}>
                <RiIcons.RiMessageLine size={isCollapsed ? 24 : 20} />
                <span>Website Inquiries</span>
              </div>
            </Nav.Item>

            {/* Website Settings */}
            <Nav.Item>
              <div className="nav-link disabled" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                <RiIcons.RiSettingsLine size={isCollapsed ? 24 : 20} />
                <span>Website Settings</span>
              </div>
            </Nav.Item>
          </Nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
