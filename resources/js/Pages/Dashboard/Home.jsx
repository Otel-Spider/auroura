import React from 'react';
import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';

export default function Home({ auth }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      <Head title="Home - Dashboard" />
      <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Topbar onToggleSidebar={toggleSidebar} auth={auth} />

        <div className="main-content">
          <Container fluid>
                    <Row className="mb-4 g-3">
                      <Col xs={12} sm={6} md={4} lg={3}>
                        <Link href="/dashboard/home/banner" as="div" className="text-decoration-none">
                          <Card className="h-100 home-banner-card">
                            <Card.Body className="p-3">
                              <div className="mb-2">
                                <RiIcons.RiDashboardLine size={32} className="text-primary" />
                              </div>
                              <h6 className="mb-1 card-title">Hero Banner</h6>
                              <p className="mb-0 text-muted small">Manage hero section with background image and feature chips</p>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>

                      <Col xs={12} sm={6} md={4} lg={3}>
                        <Link href="/dashboard/home/booking-bar" as="div" className="text-decoration-none">
                          <Card className="h-100 home-banner-card">
                            <Card.Body className="p-3">
                              <div className="mb-2">
                                <RiIcons.RiCalendarLine size={32} className="text-success" />
                              </div>
                              <h6 className="mb-1 card-title">Booking Bar</h6>
                              <p className="mb-0 text-muted small">Control booking bar text content and labels</p>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>

                      <Col xs={12} sm={6} md={4} lg={3}>
                        <Link href="/dashboard/home/gallery" as="div" className="text-decoration-none">
                          <Card className="h-100 home-banner-card">
                            <Card.Body className="p-3">
                              <div className="mb-2">
                                <RiIcons.RiImageLine size={32} className="text-info" />
                              </div>
                              <h6 className="mb-1 card-title">Gallery</h6>
                              <p className="mb-0 text-muted small">Manage resort intro gallery images and content</p>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>

                      <Col xs={12} sm={6} md={4} lg={3}>
                        <Link href="/dashboard/home/customization" as="div" className="text-decoration-none">
                          <Card className="h-100 home-banner-card">
                            <Card.Body className="p-3">
                              <div className="mb-2">
                                <RiIcons.RiLayoutLine size={32} className="text-warning" />
                              </div>
                              <h6 className="mb-1 card-title">Home Customization</h6>
                              <p className="mb-0 text-muted small">Drag and drop to reorder home page components</p>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                    </Row>
          </Container>
        </div>
      </div>
    </>
  );
}
