import React from 'react';
import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';
import axios from 'axios';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import DashboardFooter from '../../components/shared/DashboardFooter';
import { getCSRFToken } from '../../utils/csrf';
import { toast } from 'react-toastify';

export default function BookingBar({ auth }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(true);
  const [originalData, setOriginalData] = React.useState(null);
  const [bookingBarData, setBookingBarData] = React.useState({
    title: '',
    dateLabel: '',
    dateValue: '',
    guestsLabel: '',
    guestsValue: '',
    ctaText: '',
    priceCurrency: '',
    priceAmount: '',
    priceMeta: ''
  });

  // Load booking bar data on mount
  React.useEffect(() => {
    const fetchBookingBarData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/booking-bar/active');

        // Convert snake_case API response to camelCase for frontend
        const convertedData = {
          title: response.data.title,
          dateLabel: response.data.date_label,
          dateValue: response.data.date_value,
          guestsLabel: response.data.guests_label,
          guestsValue: response.data.guests_value,
          ctaText: response.data.cta_text,
          priceCurrency: response.data.price_currency,
          priceAmount: response.data.price_amount,
          priceMeta: response.data.price_meta
        };

        setBookingBarData(convertedData);
        setOriginalData(JSON.parse(JSON.stringify(convertedData)));
      } catch (err) {
        console.error('Error fetching booking bar data:', err);
        toast.error('Failed to load booking bar data');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingBarData();
  }, []);

  // Track changes
  React.useEffect(() => {
    if (originalData && bookingBarData) {
      const hasChanged = JSON.stringify(originalData) !== JSON.stringify(bookingBarData);
      setHasChanges(hasChanged);
    }
  }, [bookingBarData, originalData]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleInputChange = (field, value) => {
    setBookingBarData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const response = await axios.put('/api/booking-bar/update', bookingBarData, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      setOriginalData(JSON.parse(JSON.stringify(bookingBarData)));
      setHasChanges(false);
      console.log('Booking bar data saved:', response.data);
      toast.success('Booking bar settings saved successfully!');
    } catch (err) {
      console.error('Error saving booking bar data:', err);
      toast.error('Failed to save booking bar data: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const response = await axios.put('/api/booking-bar/update', { ...bookingBarData, published: true }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      setIsPublished(true);
      setOriginalData(JSON.parse(JSON.stringify({ ...bookingBarData, published: true })));
      setHasChanges(false);
      console.log('Booking bar data published:', response.data);
      toast.success('Booking bar settings published successfully!');
    } catch (err) {
      console.error('Error publishing booking bar data:', err);
      toast.error('Failed to publish booking bar data: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleUndo = () => {
    if (originalData) {
      setBookingBarData(originalData);
      setHasChanges(false);
      toast.info('Changes reverted to last saved version');
    }
  };

  return (
    <>
      <Head title="Booking Bar" />
      <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Topbar onToggleSidebar={toggleSidebar} auth={auth} />

        <div className="main-content">
          <Container fluid>
            {/* Breadcrumb */}
            <Row className="mb-3">
              <Col xs={12}>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/dashboard/home" className="text-decoration-none">
                        Home
                      </Link>
                    </li>
                    <li className="text-white breadcrumb-item active" aria-current="page">
                      Booking Bar
                    </li>
                  </ol>
                </nav>
              </Col>
            </Row>

            {/* Header */}
            <Row className="mb-4">
              <Col xs={12}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="text-white mb-1">Booking Bar Settings</h4>
                    <p className="text-muted mb-0 small">Control the text content of the booking bar component</p>
                  </div>
                  <div className="gap-2 d-flex">
                    {hasChanges && (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={handleUndo}
                        disabled={saving || !auth?.user}
                        className="d-flex align-items-center"
                      >
                        <RiIcons.RiArrowGoBackLine size={16} className="me-1" />
                        Undo
                      </Button>
                    )}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSave}
                      disabled={!auth?.user || saving || !hasChanges}
                      className="d-flex align-items-center"
                    >
                      {saving ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-1" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <RiIcons.RiSaveLine size={16} className="me-1" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handlePublish}
                      disabled={saving || !auth?.user}
                      className="d-flex align-items-center"
                    >
                      <RiIcons.RiGlobalLine size={16} className="me-1" />
                      Publish
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Authentication Warning */}
            {!auth?.user && (
              <Row className="mb-3">
                <Col xs={12}>
                  <Alert variant="warning">
                    <RiIcons.RiErrorWarningLine size={20} className="me-2" />
                    Please log in to save booking bar settings
                  </Alert>
                </Col>
              </Row>
            )}

            {/* Main Settings */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0 text-white">Booking Bar Content</h6>
              </Card.Header>
              <Card.Body className="p-3">
                {loading ? (
                  <div className="py-3 text-center">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2 mb-0 small">Loading booking bar settings...</p>
                  </div>
                ) : (
                  <Form>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="text-white small">Main Title</Form.Label>
                          <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Book your next ALL Inclusive Collection experience"
                            value={bookingBarData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Date Field Label</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Dates"
                            value={bookingBarData.dateLabel}
                            onChange={(e) => handleInputChange('dateLabel', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Date Field Value</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="09 Oct – 14 Oct"
                            value={bookingBarData.dateValue}
                            onChange={(e) => handleInputChange('dateValue', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Guests Field Label</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Rooms & Guests"
                            value={bookingBarData.guestsLabel}
                            onChange={(e) => handleInputChange('guestsLabel', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Guests Field Value</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="1 room – 2 guests"
                            value={bookingBarData.guestsValue}
                            onChange={(e) => handleInputChange('guestsValue', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">CTA Button Text</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="BOOK NOW"
                            value={bookingBarData.ctaText}
                            onChange={(e) => handleInputChange('ctaText', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Price Currency</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="USD"
                            value={bookingBarData.priceCurrency}
                            onChange={(e) => handleInputChange('priceCurrency', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Price Amount</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="1444.95"
                            value={bookingBarData.priceAmount}
                            onChange={(e) => handleInputChange('priceAmount', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Price Meta Text</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="5 nights – 2 guests"
                            value={bookingBarData.priceMeta}
                            onChange={(e) => handleInputChange('priceMeta', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Container>
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}
