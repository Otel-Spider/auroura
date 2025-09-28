import React from 'react';
import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Badge } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';
import axios from 'axios';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import DashboardFooter from '../../components/shared/DashboardFooter';
import StickyActionBar from '../../components/shared/StickyActionBar';
import QuillEditor from '../../components/shared/QuillEditor';
import { getCSRFToken } from '../../utils/csrf';
import { toast } from 'react-toastify';
import '../../Components/assets/css/shared/StickyActionBar.css';

export default function Gallery({ auth }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(true);
  const [originalData, setOriginalData] = React.useState(null);
  const [hasUserEdited, setHasUserEdited] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(null);
  const [editingImageIndex, setEditingImageIndex] = React.useState(null);
  const [editingImageOriginalData, setEditingImageOriginalData] = React.useState(null);
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [imageToDelete, setImageToDelete] = React.useState(null);

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

  const [bulkUpload, setBulkUpload] = React.useState({
    files: [],
    progress: 0,
    uploading: false
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
        setOriginalData(JSON.parse(JSON.stringify(convertedData)));
        setHasUserEdited(false);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        toast.error('Failed to load gallery data');
      } finally {
        setLoading(false);
      }
    };

    // Load saved draft from localStorage if it exists
    const loadSavedDraft = () => {
      try {
        const savedDraft = localStorage.getItem('gallery-draft-data');
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          setGalleryData(draftData);
          setHasUserEdited(false);
          setIsPublished(false);
          console.log('Loaded saved draft from localStorage:', draftData);
        }
      } catch (err) {
        console.warn('Could not load draft from localStorage:', err);
      }
    };

    fetchGalleryData();
    loadSavedDraft();
  }, []);

  // Track changes only if user has actually edited
  React.useEffect(() => {
    if (originalData && galleryData && hasUserEdited) {
      const hasChanged = JSON.stringify(originalData) !== JSON.stringify(galleryData);
      setHasChanges(hasChanged);
    } else if (!hasUserEdited) {
      setHasChanges(false); // No changes if user hasn't edited
    }
  }, [galleryData, originalData, hasUserEdited]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Helper function to auto-generate name and alt from file
  const autoFillImageData = (file) => {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const cleanName = nameWithoutExt
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase();

    const alt = nameWithoutExt
      .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace special chars with spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    return { name: cleanName, alt: alt };
  };

  // Check for duplicate names
  const isNameDuplicate = (name) => {
    return galleryData.images.some(img => img.name === name);
  };

  // Check for duplicate names excluding current image (for inline editing)
  const isNameDuplicateExcludingCurrent = (name, currentIndex) => {
    return galleryData.images.some((img, index) => img.name === name && index !== currentIndex);
  };

  // Handle single file selection with auto-fill
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file size (10MB max - increased from 2MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF, WebP)');
      return;
    }

    const { name, alt } = autoFillImageData(file);
    let finalName = name;
    let counter = 1;

    // Ensure unique name
    while (isNameDuplicate(finalName)) {
      finalName = `${name}-${counter}`;
      counter++;
    }

    setNewImage({
      file: file,
      name: finalName,
      alt: alt
    });
  };

  // Handle bulk file selection
  const handleBulkFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const processedFiles = [];
    const usedNames = new Set();

    Array.from(files).forEach(file => {
      // Validate file size (10MB max - increased from 2MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Image "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File "${file.name}" is not a valid image type.`);
        return;
      }

      const { name, alt } = autoFillImageData(file);
      let finalName = name;
      let counter = 1;

      // Ensure unique name (check against existing gallery images and current batch)
      while (isNameDuplicate(finalName) || usedNames.has(finalName)) {
        finalName = `${name}-${counter}`;
        counter++;
      }

      // Add to used names set for this batch
      usedNames.add(finalName);

      processedFiles.push({
        file: file,
        name: finalName,
        alt: alt,
        id: Math.random().toString(36).substr(2, 9)
      });
    });

    setBulkUpload(prev => ({
      ...prev,
      files: processedFiles,
      uploading: false,
      progress: 0
    }));

    // Start bulk upload immediately
    handleBulkUpload(processedFiles);
  };

  // Handle bulk upload process
  const handleBulkUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setBulkUpload(prev => ({ ...prev, uploading: true, progress: 0 }));

      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];

        try {
          const formData = new FormData();
          formData.append('image', fileData.file);
          formData.append('name', fileData.name);
          formData.append('alt', fileData.alt);

          const csrfToken = getCSRFToken();
          const response = await axios.post('/api/gallery/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRF-TOKEN': csrfToken,
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
            }
          });

          const uploadedImage = response.data.data;

          // Add to gallery data
          setGalleryData(prev => ({
            ...prev,
            images: [...prev.images, uploadedImage]
          }));

          // Update progress
          const progress = Math.round(((i + 1) / files.length) * 100);
          setBulkUpload(prev => ({ ...prev, progress }));

        } catch (err) {
          console.error(`Error uploading ${fileData.name}:`, err);
          toast.error(`Failed to upload ${fileData.name}: ${err.response?.data?.message || err.message}`);
        }
      }

      toast.success(`Successfully uploaded ${files.length} image(s)!`);
      setHasUserEdited(true); // Mark that user has edited

    } catch (err) {
      console.error('Bulk upload error:', err);
      toast.error('Bulk upload failed');
    } finally {
      setBulkUpload(prev => ({
        ...prev,
        uploading: false,
        progress: 0,
        files: []
      }));

      // Clear the file input
      const fileInput = document.getElementById('bulk-upload');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleInputChange = (field, value) => {
    setGalleryData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUserEdited(true); // Mark that user has edited
  };

  const handleImageDataChange = (index, field, value) => {
    setGalleryData(prev => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    }));
    setHasUserEdited(true); // Mark that user has edited
  };

  const handleAddImage = () => {
    setNewImage({ file: null, name: '', alt: '' });
    setSelectedImageIndex(null);
    setShowImageModal(true);
  };

  const handleEditImage = (index) => {
    const image = galleryData.images[index];
    setEditingImageIndex(index);
    setEditingImageOriginalData({
      name: image.name,
      alt: image.alt
    });
  };

  const handleSaveInlineEdit = async (index) => {
    const image = galleryData.images[index];
    const originalData = editingImageOriginalData;

    // Check if name or alt text has actually changed
    const nameChanged = image.name !== originalData.name;
    const altChanged = image.alt !== originalData.alt;

    if (nameChanged || altChanged) {
      try {
        // If name changed, we need to rename the file
        if (nameChanged) {
          const token = getCSRFToken();
          if (!token) {
            toast.error('CSRF token not available. Please refresh the page.');
            return;
          }

          const response = await axios.put('/api/gallery/rename-image', {
            old_path: image.src, // Current file path
            new_name: image.name,
            alt: image.alt
          }, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': token,
              'X-Requested-With': 'XMLHttpRequest'
            }
          });

          if (response.data && response.data.data) {
            // Update the image data with the new file information
            setGalleryData(prev => ({
              ...prev,
              images: prev.images.map((img, i) =>
                i === index ? {
                  ...img,
                  name: response.data.data.name,
                  alt: response.data.data.alt,
                  src: response.data.data.src,
                  path: response.data.data.path
                } : img
              )
            }));
            toast.success('Image renamed successfully');
          }
        } else {
          // Only alt text changed, just update locally
          toast.success('Image updated successfully');
        }
      } catch (error) {
        console.error('Error updating image:', error);
        if (error.response?.status === 409) {
          toast.error('A file with this name already exists');
        } else if (error.response?.status === 404) {
          toast.error('Original image not found');
        } else {
          toast.error('Failed to update image. Please try again.');
        }

        // Revert the changes on error
        setGalleryData(prev => ({
          ...prev,
          images: prev.images.map((img, i) =>
            i === index ? {
              ...img,
              name: originalData.name,
              alt: originalData.alt
            } : img
          )
        }));
        return;
      }
    }

    setEditingImageIndex(null);
    setEditingImageOriginalData(null);
    setHasUserEdited(true);
  };

  const handleCancelInlineEdit = (index) => {
    if (editingImageOriginalData) {
      // Reset the image data to original values
      setGalleryData(prev => ({
        ...prev,
        images: prev.images.map((img, i) =>
          i === index ? {
            ...img,
            name: editingImageOriginalData.name,
            alt: editingImageOriginalData.alt
          } : img
        )
      }));
    }
    setEditingImageIndex(null);
    setEditingImageOriginalData(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '';
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    const newImages = [...galleryData.images];
    const draggedImage = newImages[draggedIndex];

    // Remove dragged image from original position
    newImages.splice(draggedIndex, 1);

    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);

    setGalleryData(prev => ({
      ...prev,
      images: newImages
    }));

    setHasUserEdited(true);
    setDraggedIndex(null);
  };

  const handleImageUpload = async () => {
    if (!newImage.file || !newImage.name || !newImage.alt) {
      toast.error('Please fill in all fields and select an image');
      return;
    }

    if (isNameDuplicate(newImage.name)) {
      toast.error('This image name is already used. Please choose a different name.');
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
    setImageToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteImage = () => {
    if (imageToDelete !== null) {
      setGalleryData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== imageToDelete)
      }));
      toast.success('Image removed from gallery');
      setHasUserEdited(true); // Mark that user has edited
    }
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  const cancelDeleteImage = () => {
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  const handleSave = () => {
    try {
      // Save as draft locally (no database call)
      const draftKey = 'gallery-draft-data';
      localStorage.setItem(draftKey, JSON.stringify(galleryData));

      setOriginalData(JSON.parse(JSON.stringify(galleryData)));
      setHasChanges(false);
      setHasUserEdited(false);
      setIsPublished(false);
      console.log('Gallery data saved as draft locally:', galleryData);
      toast.success('Gallery settings saved as draft locally!');
    } catch (err) {
      console.error('Error saving draft locally:', err);
      toast.error('Failed to save draft locally');
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

      const response = await axios.put('/api/gallery/update', galleryData, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      setIsPublished(true);
      setOriginalData(JSON.parse(JSON.stringify(galleryData)));
      setHasChanges(false);
      setHasUserEdited(false);

      // Clear localStorage draft since it's now published
      try {
        localStorage.removeItem('gallery-draft-data');
      } catch (err) {
        console.warn('Could not clear draft from localStorage:', err);
      }

      console.log('Gallery data published:', response.data);
      toast.success('Gallery settings published successfully!');
    } catch (err) {
      console.error('Error publishing gallery data:', err);
      toast.error('Failed to publish gallery data: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head title="Gallery" />
      <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Topbar onToggleSidebar={toggleSidebar} auth={auth} />
        <StickyActionBar
          hasChanges={hasChanges}
          loading={saving}
          onSave={handleSave}
          onPublish={handlePublish}
          auth={auth}
        />

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
                    <div className="gap-2 mb-1 d-flex align-items-center">
                      <h4 className="mb-0 text-white">Gallery Settings</h4>
                      <Badge bg={isPublished ? "success" : hasChanges ? "danger" : "warning"} className="small">
                        {isPublished ? "Published" : hasChanges ? "Unsaved Changes" : "Draft"}
                      </Badge>
                    </div>
                    <p className="mb-0 text-white small">Control the resort intro gallery content and images</p>
                    {!auth?.user && (
                      <div className="mt-2 mb-0 alert alert-warning" role="alert">
                        ⚠️ You need to be logged in to save gallery settings
                      </div>
                    )}
                  </div>
                  <div className="gap-2 d-flex">
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
                      disabled={!auth?.user || saving}
                      className="d-flex align-items-center"
                    >
                      <RiIcons.RiGlobalLine size={16} className="me-1" />
                      Publish
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>


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
                    <p className="mt-2 text-muted">Loading gallery settings...</p>
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
                          <QuillEditor
                            data={galleryData.description}
                            onChange={(value) => handleInputChange('description', value)}
                            disabled={!auth?.user}
                            placeholder="Experience luxury and relaxation..."
                            height="200px"
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
                <div className="gap-2 d-flex">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => document.getElementById('bulk-upload').click()}
                    disabled={!auth?.user || bulkUpload.uploading}
                    className="d-flex align-items-center"
                  >
                    <RiIcons.RiUploadLine size={16} className="me-1" />
                    Bulk Upload
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleAddImage}
                    disabled={!auth?.user}
                    className="d-flex align-items-center"
                  >
                    <RiIcons.RiAddLine size={16} className="me-1" />
                    Add Image
                  </Button>
                </div>
                <input
                  id="bulk-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleBulkFileSelect(e.target.files)}
                />
              </Card.Header>
              <Card.Body>
                {/* Bulk Upload Progress */}
                {bulkUpload.uploading && (
                  <div className="mb-3">
                    <div className="mb-1 d-flex justify-content-between align-items-center">
                      <small className="text-info">Uploading images...</small>
                      <small className="text-info">{bulkUpload.progress}%</small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                        role="progressbar"
                        style={{ width: `${bulkUpload.progress}%` }}
                        aria-valuenow={bulkUpload.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                )}

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
                        <Card
                          className="h-100"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          style={{
                            cursor: 'move',
                            border: draggedIndex === index ? '2px dashed #D1BB4F' : '1px solid rgba(255,255,255,0.2)',
                            transition: 'all 0.2s ease'
                          }}
                        >
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
                                objectFit: 'cover',
                                pointerEvents: 'none'
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <RiIcons.RiDragMove2Fill size={12} />
                              Drag to reorder
                            </div>
                          </div>
                          <Card.Body className="p-2">
                            <div className="mb-2 d-flex align-items-center justify-content-between">
                              <Badge bg="primary" className="small">{index + 1}</Badge>
                              <div>
                                {editingImageIndex === index ? (
                                  <>
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      onClick={() => handleSaveInlineEdit(index)}
                                      disabled={!auth?.user || isNameDuplicateExcludingCurrent(image.name, index)}
                                      className="me-1"
                                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                    >
                                      <RiIcons.RiCheckLine size={12} />
                                    </Button>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => handleCancelInlineEdit(index)}
                                      disabled={!auth?.user}
                                      className="me-1"
                                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                    >
                                      <RiIcons.RiCloseLine size={12} />
                                    </Button>
                                  </>
                                ) : (
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
                                )}
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveImage(index)}
                                  disabled={!auth?.user || editingImageIndex === index}
                                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                >
                                  <RiIcons.RiDeleteBinLine size={12} />
                                </Button>
                              </div>
                            </div>
                            <Form.Group className="mb-1">
                              <Form.Label className="text-white small">Name:</Form.Label>
                              <Form.Control
                                type="text"
                                size="sm"
                                value={image.name}
                                onChange={(e) => handleImageDataChange(index, 'name', e.target.value)}
                                disabled={!auth?.user || editingImageIndex !== index}
                                readOnly={editingImageIndex !== index}
                                isInvalid={editingImageIndex === index && isNameDuplicateExcludingCurrent(image.name, index)}
                              />
                              {editingImageIndex === index && isNameDuplicateExcludingCurrent(image.name, index) && (
                                <Form.Control.Feedback type="invalid" className="small">
                                  This name is already used by another image.
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                            <Form.Group>
                              <Form.Label className="text-white small">Alt Text:</Form.Label>
                              <Form.Control
                                type="text"
                                size="sm"
                                value={image.alt}
                                onChange={(e) => handleImageDataChange(index, 'alt', e.target.value)}
                                disabled={!auth?.user || editingImageIndex !== index}
                                readOnly={editingImageIndex !== index}
                              />
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                    {galleryData.images.length === 0 && (
                      <Col xs={12}>
                        <div className="py-4 text-center">
                          <RiIcons.RiImageLine size={48} className="mb-3 text-muted" />
                          <p className="text-muted">No images in gallery</p>
                          <Button
                            variant="outline-primary"
                            onClick={handleAddImage}
                            disabled={!auth?.user}
                            className="d-flex align-items-center"
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
          <DashboardFooter />
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const { name, alt } = autoFillImageData(file);
                    let finalName = name;
                    let counter = 1;

                    // Ensure unique name
                    while (isNameDuplicate(finalName)) {
                      finalName = `${name}-${counter}`;
                      counter++;
                    }

                    setNewImage(prev => ({
                      ...prev,
                      file: file,
                      name: finalName,
                      alt: alt
                    }));
                  }
                }}
              />
              <Form.Text className="text-muted">
                Upload an image file (JPEG, PNG, JPG, GIF, WebP) - Max 10MB. Name and Alt text will be auto-filled.
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewImage(prev => ({ ...prev, name: value }));
                    }}
                    isInvalid={newImage.name && isNameDuplicate(newImage.name)}
                  />
                  {newImage.name && isNameDuplicate(newImage.name) && (
                    <Form.Control.Feedback type="invalid">
                      This name is already used by another image. Please choose a different name.
                    </Form.Control.Feedback>
                  )}
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
          <Button
            variant="secondary"
            onClick={() => setShowImageModal(false)}
            className="d-flex align-items-center"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImageUpload}
            disabled={uploadingImage || !newImage.file || !newImage.name || !newImage.alt || isNameDuplicate(newImage.name)}
            className="d-flex align-items-center"
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

      {/* Enhanced Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={cancelDeleteImage}
        centered
        size="md"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          className="pb-2 border-0"
          style={{
            background: 'linear-gradient(135deg, #d1bb4f 0%, #b8a542 100%)',
            color: 'white'
          }}
        >
          <Modal.Title className="d-flex align-items-center">
            <div
              className="me-2 d-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                backdropFilter: 'blur(10px)'
              }}
            >
              <RiIcons.RiDeleteBinLine size={16} />
            </div>
            <div>
              <h6 className="mb-0">Delete Image</h6>
              <small className="opacity-75">Permanent action</small>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3 pb-3">
          <div className="text-center">
            {/* Smaller Warning Icon */}
            <div
              className="mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #d1bb4f 0%, #b8a542 100%)',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'pulse 2s infinite'
              }}
            >
              <RiIcons.RiDeleteBinLine size={24} className="text-white" />
            </div>

            <h5 className="mb-2 text-dark">Are you sure?</h5>
            <p className="mb-3 text-muted small">
              This action <strong>cannot be undone</strong>. The image will be permanently removed.
            </p>

            {/* Compact Image Preview */}
            {imageToDelete !== null && galleryData.images[imageToDelete] && (
              <div
                className="mx-auto mb-3"
                style={{
                  maxWidth: '200px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="position-relative">
                  <img
                    src={galleryData.images[imageToDelete].src}
                    alt={galleryData.images[imageToDelete].alt}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #fff'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(255,107,107,0.9)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}
                  >
                    <RiIcons.RiDeleteBinLine size={10} />
                  </div>
                </div>

                <div className="mt-2 text-start">
                  <div className="small text-muted">
                    <div className="mb-1">
                      <strong>Name:</strong>
                      <span
                        className="text-dark d-block text-truncate"
                        style={{ maxWidth: '160px' }}
                        title={galleryData.images[imageToDelete].name}
                      >
                        {galleryData.images[imageToDelete].name}
                      </span>
                    </div>
                    <div>
                      <strong>Position:</strong> #{imageToDelete + 1}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Warning */}
            <div
              className="py-2 border-0 alert alert-warning"
              style={{
                background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                borderRadius: '6px',
                border: '1px solid #ffeaa7'
              }}
            >
              <div className="d-flex align-items-center">
                <RiIcons.RiErrorWarningLine size={16} className="me-2 text-warning" />
                <div className="small">
                  <strong>Warning:</strong> This will affect gallery order.
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-0 pb-3 border-0">
          <div className="gap-2 w-100 d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={cancelDeleteImage}
              size="sm"
              className="px-3 d-flex align-items-center"
            >
              <RiIcons.RiCloseLine size={14} className="me-2" />
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteImage}
              size="sm"
              className="px-3 d-flex align-items-center"
              style={{
                background: 'linear-gradient(135deg, #d1bb4f 0%, #b8a542 100%)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(255,107,107,0.3)'
              }}
            >
              <RiIcons.RiDeleteBinLine size={14} className="me-2" />
              Delete
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Add CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
          }
        }
      `}</style>
    </>
  );
}
