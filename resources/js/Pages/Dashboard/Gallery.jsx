import React from 'react';
import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Badge } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';
import axios from 'axios';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import { getCSRFToken } from '../../utils/csrf';
import { toast } from 'react-toastify';

export default function Gallery({ auth }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(null);

  const [galleryData, setGalleryData] = React.useState({
    title: '',
    description: '',
    checkIn: '',
    checkOut: '',
    images: []
  });

  const [newImage, setNewImage] = React.useState({
    file: null,
    name: '',
    alt: ''
  });

  // Load gallery data on mount
  React.useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/gallery/active');

        // Convert snake_case API response to camelCase for frontend
        const convertedData = {
          title: response.data.title,
          description: response.data.description,
          checkIn: response.data.check_in,
          checkOut: response.data.check_out,
          images: response.data.images || []
        };

        setGalleryData(convertedData);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        toast.error('Failed to load gallery data');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleInputChange = (field, value) => {
    setGalleryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageDataChange = (index, field, value) => {
    setGalleryData(prev => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleAddImage = () => {
    setNewImage({ file: null, name: '', alt: '' });
    setSelectedImageIndex(null);
    setShowImageModal(true);
  };

  const handleEditImage = (index) => {
    const image = galleryData.images[index];
    setNewImage({
      file: null,
      name: image.name || '',
      alt: image.alt || ''
    });
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleImageUpload = async () => {
    if (!newImage.file || !newImage.name || !newImage.alt) {
      toast.error('Please fill in all fields and select an image');
      return;
    }

    try {
      setUploadingImage(true);
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const formData = new FormData();
      formData.append('image', newImage.file);
      formData.append('name', newImage.name);
      formData.append('alt', newImage.alt);

      const response = await axios.post('/api/gallery/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      const uploadedImage = response.data.data;

      if (selectedImageIndex !== null) {
        // Replace existing image
        setGalleryData(prev => ({
          ...prev,
          images: prev.images.map((img, i) =>
            i === selectedImageIndex ? uploadedImage : img
          )
        }));
      } else {
        // Add new image
        setGalleryData(prev => ({
          ...prev,
          images: [...prev.images, uploadedImage]
        }));
      }

      setShowImageModal(false);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    if (confirm('Are you sure you want to remove this image?')) {
      setGalleryData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      toast.success('Image removed from gallery');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error('CSRF token not available. Please refresh the page.');
        return;
      }

      const response = await axios.put('/api/gallery/update', galleryData, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      console.log('Gallery data saved:', response.data);
      toast.success('Gallery settings saved successfully!');
    } catch (err) {
      console.error('Error saving gallery data:', err);
      toast.error('Failed to save gallery data: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head title="Gallery - Dashboard" />
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
                      Gallery
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
                    <h2 className="text-white mb-1">Gallery Settings</h2>
                    <p className="text-muted mb-0">Control the resort intro gallery content and images</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!auth?.user || saving}
                  >
                    {saving ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <RiIcons.RiSaveLine size={16} className="me-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Authentication Warning */}
            {!auth?.user && (
              <Row className="mb-3">
                <Col xs={12}>
                  <Alert variant="warning">
                    <RiIcons.RiErrorWarningLine size={20} className="me-2" />
                    Please log in to save gallery settings
                  </Alert>
                </Col>
              </Row>
            )}

            {/* Text Content Settings */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0 text-white">Gallery Content</h6>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="py-4 text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading gallery settings...</p>
                  </div>
                ) : (
                  <Form>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Title</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Welcome to Rixos Sharm El Sheikh Adults Only 18+"
                            value={galleryData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Experience luxury and relaxation..."
                            value={galleryData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Check-in Time</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Check-in – 2:00 PM"
                            value={galleryData.checkIn}
                            onChange={(e) => handleInputChange('checkIn', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Check-out Time</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Check-out – 12:00 PM"
                            value={galleryData.checkOut}
                            onChange={(e) => handleInputChange('checkOut', e.target.value)}
                            disabled={!auth?.user}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Card.Body>
            </Card>

            {/* Gallery Images */}
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 text-white">Gallery Images</h6>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={handleAddImage}
                  disabled={!auth?.user}
                >
                  <RiIcons.RiAddLine size={16} className="me-1" />
                  Add Image
                </Button>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="py-4 text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <Row>
                    {galleryData.images.map((image, index) => (
                      <Col md={6} lg={4} key={index} className="mb-3">
                        <Card className="h-100">
                          <div style={{ position: 'relative', paddingBottom: '60%', overflow: 'hidden' }}>
                            <img
                              src={image.src}
                              alt={image.alt}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                          <Card.Body className="p-2">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <Badge bg="primary" className="small">{index + 1}</Badge>
                              <div>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleEditImage(index)}
                                  disabled={!auth?.user}
                                  className="me-1"
                                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                >
                                  <RiIcons.RiEditLine size={12} />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveImage(index)}
                                  disabled={!auth?.user}
                                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                >
                                  <RiIcons.RiDeleteBinLine size={12} />
                                </Button>
                              </div>
                            </div>
                            <Form.Group className="mb-1">
                              <Form.Label className="small text-white">Name:</Form.Label>
                              <Form.Control
                                type="text"
                                size="sm"
                                value={image.name}
                                onChange={(e) => handleImageDataChange(index, 'name', e.target.value)}
                                disabled={!auth?.user}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label className="small text-white">Alt Text:</Form.Label>
                              <Form.Control
                                type="text"
                                size="sm"
                                value={image.alt}
                                onChange={(e) => handleImageDataChange(index, 'alt', e.target.value)}
                                disabled={!auth?.user}
                              />
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                    {galleryData.images.length === 0 && (
                      <Col xs={12}>
                        <div className="text-center py-4">
                          <RiIcons.RiImageLine size={48} className="text-muted mb-3" />
                          <p className="text-muted">No images in gallery</p>
                          <Button
                            variant="outline-primary"
                            onClick={handleAddImage}
                            disabled={!auth?.user}
                          >
                            <RiIcons.RiAddLine size={16} className="me-1" />
                            Add First Image
                          </Button>
                        </div>
                      </Col>
                    )}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>

      {/* Image Upload Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedImageIndex !== null ? 'Edit Image' : 'Add New Image'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(prev => ({ ...prev, file: e.target.files[0] }))}
              />
              <Form.Text className="text-muted">
                Upload an image file (JPEG, PNG, JPG, GIF, WebP) - Max 2MB
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., resort-exterior"
                    value={newImage.name}
                    onChange={(e) => setNewImage(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alt Text</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Resort exterior view"
                    value={newImage.alt}
                    onChange={(e) => setNewImage(prev => ({ ...prev, alt: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImageUpload}
            disabled={uploadingImage || !newImage.file || !newImage.name || !newImage.alt}
          >
            {uploadingImage ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Uploading...
              </>
            ) : (
              selectedImageIndex !== null ? 'Update Image' : 'Add Image'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
