import React from 'react';
import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';
import axios from 'axios';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import { useHero } from '../../contexts/HeroContext';
import { getCSRFToken, refreshCSRFToken } from '../../utils/csrf';
import { toast } from 'react-toastify';

export default function Banner({ auth }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Use HeroContext for state management
  const { heroData, loading, error, updateHeroField, toggleChip, updateChipLabel, addNewChip, removeChip, updateHeroData, setHeroDataFromResponse, uploadChipImages, renameBackgroundImage } = useHero();

  // Debug authentication and CSRF token
  React.useEffect(() => {
    console.log('Banner page - Auth status:', auth);
    if (!auth?.user) {
      console.warn('User not authenticated');
    }

    // Debug CSRF token
    const token = getCSRFToken();
    console.log('Banner page - CSRF token:', token);
  }, [auth]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleInputChange = (field, value) => {
    updateHeroField(field, value);
  };

  const handleChipToggle = (chipKey) => {
    toggleChip(chipKey);
  };

  const handleChipLabelChange = (chipKey, newLabel) => {
    updateChipLabel(chipKey, newLabel);
  };

  const handleChipImageUpload = async (chipKey, file) => {
    if (!file) return;

    // Validate file size (1MB max for chip images)
    if (file.size > 1024 * 1024) {
      toast.error('Chip image size must be less than 1MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF, WebP)');
      return;
    }

    try {
      const chipImages = { [chipKey]: file };
      await uploadChipImages(chipImages);
    } catch (err) {
      console.error('Error uploading chip image:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF, WebP)');
      return;
    }

    try {
      // Get fresh CSRF token
      const token = getCSRFToken();
      if (!token) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const formData = new FormData();
      formData.append('bg_image', file);
      formData.append('title', heroData.title || '');
      formData.append('location', heroData.location || '');
      formData.append('stars', heroData.stars || 5);
      // Only append bg_image_url if it's not empty
      if (heroData.bgImageUrl && heroData.bgImageUrl.trim() !== '') {
        formData.append('bg_image_url', heroData.bgImageUrl);
      }
      formData.append('bg_image_alt', heroData.bgImageAlt || '');
      formData.append('bg_image_name', heroData.bgImageName || '');
      formData.append('rating_score', heroData.ratingScore || '4.8/5');
      formData.append('rating_reviews', heroData.ratingReviews || '900 reviews');
      formData.append('chips', JSON.stringify(heroData.chips || []));

      const response = await axios.post('/api/hero/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      console.log('Image uploaded successfully:', response.data);

      // Update the hero context with the new data
      if (response.data && response.data.data) {
        console.log('Updating hero context with:', response.data.data);
        setHeroDataFromResponse(response.data.data);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error details:', err.response?.data?.details);

      if (err.response?.status === 419) {
        // Try to refresh CSRF token and retry
        console.log('CSRF mismatch detected. Attempting to refresh token and retry...');
        try {
          const newToken = await refreshCSRFToken();
          if (newToken) {
            console.log('Got new CSRF token, retrying upload...');

            // Rebuild the FormData with the same data
            const retryFormData = new FormData();
            retryFormData.append('bg_image', file);
            retryFormData.append('title', heroData.title || '');
            retryFormData.append('location', heroData.location || '');
            retryFormData.append('stars', heroData.stars || 5);
            if (heroData.bgImageUrl && heroData.bgImageUrl.trim() !== '') {
              retryFormData.append('bg_image_url', heroData.bgImageUrl);
            }
            retryFormData.append('bg_image_alt', heroData.bgImageAlt || '');
            retryFormData.append('bg_image_name', heroData.bgImageName || '');
            retryFormData.append('rating_score', heroData.ratingScore || '4.8/5');
            retryFormData.append('rating_reviews', heroData.ratingReviews || '900 reviews');
            retryFormData.append('chips', JSON.stringify(heroData.chips || []));

            const retryResponse = await axios.post('/api/hero/update', retryFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': newToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
              }
            });

            console.log('Image uploaded successfully on retry:', retryResponse.data);

            if (retryResponse.data && retryResponse.data.data) {
              setHeroDataFromResponse(retryResponse.data.data);
            }
            toast.success('Image uploaded successfully!');
            return; // Success, exit early
          } else {
            throw new Error('Failed to get new CSRF token');
          }
        } catch (retryErr) {
          console.error('Retry failed:', retryErr);
          toast.error('Failed to upload image after retry: ' + (retryErr.response?.data?.message || retryErr.message || 'Please refresh the page and try again.'));
        }
      } else {
        toast.error('Failed to upload image: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateHeroData(heroData);
      console.log('Hero data saved to database:', heroData);
      toast.success('Hero settings saved successfully!');
    } catch (err) {
      console.error('Error saving hero data:', err);
      toast.error('Failed to save hero data: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRenameFile = async () => {
    const newName = prompt('Enter new file name (without extension):',
      heroData.bgImage ? heroData.bgImage.split('/').pop().split('.')[0] : '');

    if (newName && newName.trim() !== '') {
      const cleanName = newName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      await renameBackgroundImage(cleanName);
    }
  };

  return (
    <>
      <Head title="Home Banner - Dashboard" />
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
                      Banner
                    </li>
                  </ol>
                </nav>
              </Col>
            </Row>

            {/* Page Header */}
            <Row className="mb-4">
              <Col xs={12}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mb-1 text-white">Home Banner</h4>
                    <p className="mb-0 text-white">Manage your home banner settings and content</p>
                    {error && (
                      <div className="mt-2 mb-0 alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    {!auth?.user && (
                      <div className="mt-2 mb-0 alert alert-warning" role="alert">
                        ⚠️ You need to be logged in to save hero settings
                      </div>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="d-flex align-items-center"
                    onClick={handleSave}
                    disabled={loading || !auth?.user}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save Changes</span>
                        <RiIcons.RiSaveLine className="ms-2" size={16} />
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Hero Settings */}
            <Row className="g-3">
              <Col xs={12} lg={8}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0 text-white">Hero Section Content</h6>
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <div className="py-4 text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-white">Loading hero settings...</p>
                      </div>
                    ) : (
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Resort Title</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter resort title"
                              value={heroData.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              disabled={!auth?.user}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Location</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter location"
                              value={heroData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Star Rating</Form.Label>
                            <Form.Select
                              value={heroData.stars}
                              onChange={(e) => handleInputChange('stars', parseInt(e.target.value))}
                            >
                              <option value={1}>1 Star</option>
                              <option value={2}>2 Stars</option>
                              <option value={3}>3 Stars</option>
                              <option value={4}>4 Stars</option>
                              <option value={5}>5 Stars</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Rating Score</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="4.8/5"
                              value={heroData.ratingScore}
                              onChange={(e) => handleInputChange('ratingScore', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Reviews Text</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="900 reviews"
                              value={heroData.ratingReviews}
                              onChange={(e) => handleInputChange('ratingReviews', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">Background Image</Form.Label>
                        <div className="mb-2">
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e)}
                            className="text-white"
                          />
                          <Form.Text className="text-muted">
                            Upload an image file (JPEG, PNG, JPG, GIF, WebP) - Max 2MB
                          </Form.Text>
                        </div>
                        <div className="mb-2">
                          <Form.Label className="text-white small">Or use URL:</Form.Label>
                          <Form.Control
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={heroData.bgImageUrl}
                            onChange={(e) => handleInputChange('bgImageUrl', e.target.value)}
                          />
                        </div>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-2">
                              <Form.Label className="text-white small">Image Alt Text:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Resort Hero Background"
                                value={heroData.bgImageAlt}
                                onChange={(e) => handleInputChange('bgImageAlt', e.target.value)}
                                disabled={!auth?.user}
                              />
                            </Form.Group>
                          </Col>
                                  <Col md={6}>
                                    <Form.Group className="mb-2">
                                      <Form.Label className="text-white small">Image Name:</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="hero-background"
                                        value={heroData.bgImageName || ''}
                                        onChange={(e) => handleInputChange('bgImageName', e.target.value)}
                                        disabled={!auth?.user}
                                      />
                                      {heroData.bgImage && (
                                        <div className="gap-2 mt-1 d-flex align-items-center">
                                          <Form.Text className="mb-0 text-muted small">
                                            File path: <code>/storage/{heroData.bgImage}</code>
                                          </Form.Text>
                                          <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={handleRenameFile}
                                            disabled={!auth?.user}
                                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                            title="Rename file"
                                          >
                                            <RiIcons.RiEditLine size={12} />
                                          </Button>
                                        </div>
                                      )}
                                    </Form.Group>
                                  </Col>
                        </Row>
                      </Form.Group>

                    </Form>
                    )}
                  </Card.Body>
                </Card>

                {                /* Feature Chips Control */}
                <Card className="mt-3">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-white">Feature Chips</h6>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={addNewChip}
                      disabled={!auth?.user}
                    >
                      <RiIcons.RiAddLine size={16} className="me-1" />
                      Add Chip
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <div className="py-4 text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-white">Loading chips...</p>
                      </div>
                    ) : (
                            <Row>
                              {heroData.chips.map((chip) => (
                                <Col md={6} lg={4} key={chip.key} className="mb-3">
                                  <div className="d-flex align-items-center">
                                    <Form.Check
                                      type="checkbox"
                                      id={`chip-${chip.key}`}
                                      checked={chip.enabled}
                                      onChange={() => handleChipToggle(chip.key)}
                                      className="me-2"
                                      disabled={!auth?.user}
                                    />
                                    <Form.Label htmlFor={`chip-${chip.key}`} className="mb-0 text-white me-2">
                                      {chip.label}
                                    </Form.Label>
                                    <Badge bg={chip.enabled ? "success" : "secondary"} className="me-2">
                                      {chip.icon}
                                    </Badge>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => removeChip(chip.key)}
                                      disabled={!auth?.user}
                                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                    >
                                      <RiIcons.RiCloseLine size={12} />
                                    </Button>
                                  </div>
                                  {chip.enabled && (
                                    <>
                                      <Form.Control
                                        type="text"
                                        size="sm"
                                        value={chip.label}
                                        onChange={(e) => handleChipLabelChange(chip.key, e.target.value)}
                                        className="mt-1"
                                      />

                                      {/* Chip Image Upload */}
                                      <div className="mt-2">
                                        <Form.Label className="text-white small">Chip Icon:</Form.Label>
                                        <div className="gap-2 d-flex align-items-center">
                                          {/* Current Icon Preview */}
                                          <div className="d-flex align-items-center justify-content-center" style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'var(--chip)',
                                            borderRadius: '8px',
                                            color: 'var(--text)'
                                          }}>
                                            {heroData.chipImages && heroData.chipImages[chip.key] ? (
                                              <img
                                                src={`/storage/${heroData.chipImages[chip.key]}`}
                                                alt={chip.label}
                                                style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                                              />
                                            ) : (
                                              <span style={{ fontSize: '0rem' }}>{chip.icon}</span>
                                            )}
                                          </div>

                                          {/* Upload Button */}
                                          <Form.Control
                                            type="file"
                                            accept="image/*"
                                            size="sm"
                                            onChange={(e) => handleChipImageUpload(chip.key, e.target.files[0])}
                                            style={{ fontSize: '0.8rem' }}
                                          />
                                        </div>
                                        <Form.Text className="text-muted small">
                                          Upload custom icon (max 1MB)
                                        </Form.Text>
                                      </div>
                                    </>
                                  )}
                                </Col>
                              ))}
                            </Row>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} lg={4}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0 text-white">Hero Preview</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="hero-preview" style={{ height: '400px', overflow: 'hidden', borderRadius: '8px' }}>
                            <div
                              style={{
                                backgroundImage: `url(${heroData.bgImage ? `/storage/${heroData.bgImage}` : heroData.bgImageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '100%',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                textAlign: 'center',
                                padding: '1rem'
                              }}
                            >
                        {/* Background overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 17.39%, rgba(0,0,0,0.3) 65.1%, rgba(0,0,0,0.3))',
                            zIndex: 1
                          }}
                        />

                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 2, maxWidth: '90%' }}>
                          <h4 className="mb-2" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                            {heroData.title}
                          </h4>

                          {/* Stars */}
                          <div className="gap-1 mb-2 d-flex justify-content-center">
                            {[...Array(5)].map((_, index) => (
                              <span key={index} style={{ color: index < heroData.stars ? '#c4a462' : 'rgba(255,255,255,0.3)' }}>
                                ★
                              </span>
                            ))}
                          </div>

                          {/* Location */}
                          <p className="mb-2 small">📍 {heroData.location}</p>

                          {/* Feature Chips */}
                          <div className="flex-wrap gap-1 mb-2 d-flex justify-content-center">
                            {heroData.chips.filter(chip => chip.enabled).slice(0, 4).map((chip) => (
                              <Badge key={chip.key} bg="light" text="dark" className="small">
                                {chip.label}
                              </Badge>
                            ))}
                            {heroData.chips.filter(chip => chip.enabled).length > 4 && (
                              <Badge bg="light" text="dark" className="small">
                                +{heroData.chips.filter(chip => chip.enabled).length - 4} more
                              </Badge>
                            )}
                          </div>

                          {/* Rating Badge */}
                          <div className="gap-2 d-flex align-items-center justify-content-center">
                            <Badge bg="warning" text="dark">
                              {heroData.ratingScore}
                            </Badge>
                            <small>{heroData.ratingReviews}</small>
                          </div>

                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}
