import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Dropdown, Modal, Form } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Custom CSS for dropdown z-index fix and button alignment
const dropdownStyles = `
  .dropdown-menu-custom {
    z-index: 99999 !important;
  }

  .dropdown-menu-custom .dropdown-item:hover {
    background-color: #f8f9fa;
  }

  /* Fix for dropdown being covered by sibling cards */
  .sortable-item-wrapper {
    position: relative;
    z-index: 1;
  }

  .sortable-item-wrapper:has(.dropdown.show) {
    z-index: 9999 !important;
  }

  /* Button alignment fixes */
  .btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.375rem !important;
  }

  .btn .spinner-border-sm {
    margin-right: 0 !important;
  }

  .dropdown-item {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
  }

  .dropdown-item svg {
    flex-shrink: 0 !important;
  }

  .alert {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
  }

  .alert svg {
    flex-shrink: 0 !important;
  }

  /* Modal styling to match dashboard theme */
  .modal-content {
    background-color: #1a1a1a !important;
    border: 1px solid #333 !important;
    color: #fff !important;
  }

  .modal-header {
    background-color: #2d2d2d !important;
    border-bottom: 1px solid #333 !important;
  }

  .modal-header .btn-close {
    filter: invert(1) !important;
  }

  .modal-body {
    background-color: #1a1a1a !important;
  }

  .modal-footer {
    background-color: #2d2d2d !important;
    border-top: 1px solid #333 !important;
  }

  .modal-body .form-control {
    background-color: #333 !important;
    border: 1px solid #555 !important;
    color: #fff !important;
  }

  .modal-body .form-control:focus {
    background-color: #333 !important;
    border-color: #007bff !important;
    color: #fff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  }

  .modal-body .form-label {
    color: #fff !important;
  }

  .modal-body h6 {
    color: #fff !important;
  }

  .modal-body small {
    color: #ccc !important;
  }

  .modal-body ol {
    color: #ccc !important;
  }

  .modal-body .badge {
    color: #fff !important;
  }
`;

// Component data with icons and descriptions
const homeComponents = [
  {
    id: 'resort-hero',
    name: 'Resort Hero',
    description: 'Main hero section with background image and feature chips',
    icon: RiIcons.RiImageLine,
    color: 'text-primary'
  },
  {
    id: 'booking-bar',
    name: 'Booking Bar',
    description: 'Booking form with date and guest selection',
    icon: RiIcons.RiCalendarLine,
    color: 'text-success'
  },
  {
    id: 'resort-intro-gallery',
    name: 'Resort Intro Gallery',
    description: 'Introduction gallery showcasing the resort',
    icon: RiIcons.RiGalleryLine,
    color: 'text-info'
  },
  {
    id: 'facilities',
    name: 'Facilities',
    description: 'Resort facilities and amenities showcase',
    icon: RiIcons.RiBuildingLine,
    color: 'text-warning'
  },
  {
    id: 'rooms-section',
    name: 'Rooms Section',
    description: 'Accommodation options and room types',
    icon: RiIcons.RiHotelLine,
    color: 'text-danger'
  },
  {
    id: 'entertainment-strip',
    name: 'Entertainment Strip',
    description: 'Entertainment and activities overview',
    icon: RiIcons.RiGamepadLine,
    color: 'text-primary'
  },
  {
    id: 'dining-carousel',
    name: 'Dining Carousel',
    description: 'Restaurant and dining options showcase',
    icon: RiIcons.RiRestaurantLine,
    color: 'text-success'
  },
  {
    id: 'activity-showcase',
    name: 'Activity Showcase',
    description: 'Featured activities and experiences',
    icon: RiIcons.RiRunLine,
    color: 'text-info'
  },
  {
    id: 'activities-grid',
    name: 'Activities Grid',
    description: 'Sports and fitness activities grid',
    icon: RiIcons.RiBasketballLine,
    color: 'text-warning'
  },
  {
    id: 'wellness-pairs-slider',
    name: 'Wellness Pairs Slider',
    description: 'Wellness and spa experiences',
    icon: RiIcons.RiHealthBookLine,
    color: 'text-danger'
  },
  {
    id: 'offers-deck',
    name: 'Offers Deck',
    description: 'Special offers and packages',
    icon: RiIcons.RiGiftLine,
    color: 'text-primary'
  },
  {
    id: 'events-showcase',
    name: 'Events Showcase',
    description: 'Private events and celebrations',
    icon: RiIcons.RiCalendarEventLine,
    color: 'text-success'
  },
  {
    id: 'location-map',
    name: 'Location Map',
    description: 'Resort location and contact information',
    icon: RiIcons.RiMapPinLine,
    color: 'text-info'
  },
  {
    id: 'guest-reviews',
    name: 'Guest Reviews',
    description: 'Customer testimonials and reviews',
    icon: RiIcons.RiStarLine,
    color: 'text-warning'
  },
  {
    id: 'vertical-spotlight-slider',
    name: 'Vertical Spotlight Slider',
    description: 'Featured content spotlight',
    icon: RiIcons.RiSlideshowLine,
    color: 'text-danger'
  },
  {
    id: 'become-member',
    name: 'Become Member',
    description: 'Membership program and benefits',
    icon: RiIcons.RiVipCrownLine,
    color: 'text-primary'
  }
];

// Sortable Item Component
function SortableItem({ id, component, onEdit, onToggleVisibility, onDuplicate, onDelete, isVisible = true, currentOrder }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = component.icon;

  // Check if this component supports actions (hero, booking-bar, resort-intro-gallery)
  // Extract base component ID (remove variant suffix if present)
  const baseComponentId = component.id.includes('-') && component.variantName
    ? component.id.replace(`-${component.variantName}`, '')
    : component.id;
  const supportsActions = ['resort-hero', 'booking-bar', 'resort-intro-gallery'].includes(baseComponentId);

  return (
    <div ref={setNodeRef} style={style} className="sortable-item-wrapper">
      <Card className={`mb-3 border-0 shadow-sm ${!isVisible ? 'opacity-50' : ''}`}>
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col xs="auto" {...attributes} {...listeners}>
              <div className="drag-handle me-3">
                <RiIcons.RiDragMoveLine size={20} className="text-muted" />
              </div>
            </Col>
            <Col xs="auto">
              <IconComponent size={24} className={component.color} />
            </Col>
            <Col>
              <h6 className="mb-1 text-white">
                {component.displayName || component.name}
                {!isVisible && <span className="badge bg-secondary ms-2 small">Hidden</span>}
              </h6>
              <p className="mb-0 text-muted small">{component.description}</p>
            </Col>
            <Col xs="auto">
              <div className="badge bg-light text-dark me-2">
                {currentOrder}
              </div>
            </Col>
            {supportsActions && (
              <Col xs="auto">
                <Dropdown flip={false}>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" id={`dropdown-${id}`}>
                    <RiIcons.RiMoreLine />
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="dropdown-menu-custom"
                    style={{ zIndex: 99999 }}
                    popperConfig={{
                      modifiers: [
                        {
                          name: 'preventOverflow',
                          options: {
                            boundary: 'viewport',
                          },
                        },
                        {
                          name: 'flip',
                          options: {
                            fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                          },
                        },
                      ],
                    }}
                  >
                    <Dropdown.Item onClick={() => onEdit(component)}>
                      <RiIcons.RiEditLine />
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onToggleVisibility(component)}>
                      {isVisible ? (
                        <>
                          <RiIcons.RiEyeOffLine />
                          Hide
                        </>
                      ) : (
                        <>
                          <RiIcons.RiEyeLine />
                          Show
                        </>
                      )}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onDuplicate(component)}>
                      <RiIcons.RiFileCopyLine />
                      Duplicate
                    </Dropdown.Item>
                    {component.variantName && (
                      <Dropdown.Item
                        onClick={() => onDelete(component)}
                        className="text-danger"
                      >
                        <RiIcons.RiDeleteBinLine />
                        Delete
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default function HomeCustomization({ auth }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [components, setComponents] = useState(homeComponents);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Duplicate modal state
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateComponent, setDuplicateComponent] = useState(null);
  const [duplicateName, setDuplicateName] = useState('');

  // Info modal state
  const [showInfoModal, setShowInfoModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Load component order on mount
  useEffect(() => {
    const loadComponentOrder = async () => {
      try {
        const response = await axios.get('/api/home-customization/component-order');

        if (response.data.components && response.data.components.length > 0) {
          const orderedComponents = response.data.components.map(componentData => {
            const baseComponent = homeComponents.find(comp => comp.id === componentData.id);
            if (baseComponent) {
              return {
                ...baseComponent,
                id: componentData.variant_name ? `${componentData.id}-${componentData.variant_name}` : componentData.id,
                name: componentData.display_name || baseComponent.name,
                displayName: componentData.display_name || baseComponent.name,
                variantName: componentData.variant_name,
                isOriginal: componentData.is_original,
                isVisible: componentData.is_visible
              };
            }
            return null;
          }).filter(Boolean);

          setComponents(orderedComponents);
        } else {
          // If no custom order exists, use default components with proper structure
          const defaultComponentsWithStructure = homeComponents.map(comp => ({
            ...comp,
            id: comp.id,
            name: comp.name,
            displayName: comp.name,
            variantName: null,
            isOriginal: true,
            isVisible: true
          }));
          setComponents(defaultComponentsWithStructure);
        }
      } catch (err) {
        console.error('Error loading component order:', err);
        setError('Failed to load component order');
        // Fallback to default components with proper structure
        const defaultComponentsWithStructure = homeComponents.map(comp => ({
          ...comp,
          id: comp.id,
          name: comp.name,
          displayName: comp.name,
          variantName: null,
          isOriginal: true,
          isVisible: true
        }));
        setComponents(defaultComponentsWithStructure);
      } finally {
        setIsLoading(false);
      }
    };

    loadComponentOrder();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Send the full component identifiers (including variant names)
      const componentIds = components.map(comp => comp.id);

      await axios.put('/api/home-customization/component-order', {
        components: componentIds
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving component order:', err);
      setError('Failed to save component order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post('/api/home-customization/reset');
      // Reset to default components with proper structure
      const defaultComponentsWithStructure = homeComponents.map(comp => ({
        ...comp,
        id: comp.id,
        name: comp.name,
        displayName: comp.name,
        variantName: null,
        isOriginal: true,
        isVisible: true
      }));
      setComponents(defaultComponentsWithStructure);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error resetting component order:', err);
      setError('Failed to reset component order');
    }
  };

  // Action handlers
  const handleEdit = (component) => {
    // Navigate to edit page based on component type
    const editRoutes = {
      'resort-hero': '/dashboard/home/banner',
      'booking-bar': '/dashboard/home/booking-bar',
      'resort-intro-gallery': '/dashboard/home/gallery'
    };

    // Extract base component ID (remove variant suffix if present)
    const baseComponentId = component.id.includes('-') && component.variantName
      ? component.id.replace(`-${component.variantName}`, '')
      : component.id;

    let route = editRoutes[baseComponentId];
    if (route) {
      // If it's a variant, add the variant parameter
      if (component.variantName) {
        route += `/${component.variantName}`;
      }
      window.location.href = route;
    }
  };

  const handleToggleVisibility = async (component) => {
    try {
      // Extract base component ID
      const baseComponentId = component.id.includes('-') && component.variantName
        ? component.id.replace(`-${component.variantName}`, '')
        : component.id;

      await axios.post('/api/home-customization/toggle-visibility', {
        component_id: baseComponentId,
        variant_name: component.variantName
      });

      // Update local state
      setComponents(prev => prev.map(comp =>
        comp.id === component.id
          ? { ...comp, isVisible: !comp.isVisible }
          : comp
      ));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error toggling visibility:', err);
      setError('Failed to toggle component visibility');
    }
  };

  const handleDuplicate = (component) => {
    // Extract base component ID for duplication
    const baseComponentId = component.id.includes('-') && component.variantName
      ? component.id.replace(`-${component.variantName}`, '')
      : component.id;

    const baseComponent = homeComponents.find(comp => comp.id === baseComponentId);
    if (baseComponent) {
      setDuplicateComponent({
        ...baseComponent,
        id: baseComponentId
      });
      setDuplicateName(`${component.displayName || component.name} Copy`);
      setShowDuplicateModal(true);
    }
  };

  const handleDelete = async (component) => {
    // Only allow deletion of variants (not original components)
    if (!component.variantName) {
      alert('Cannot delete the original component');
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${component.displayName || component.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Extract base component ID
      const baseComponentId = component.id.includes('-') && component.variantName
        ? component.id.replace(`-${component.variantName}`, '')
        : component.id;

      const response = await axios.delete('/api/home-customization/delete-variant', {
        data: {
          component_id: baseComponentId,
          variant_name: component.variantName
        }
      });

      // Remove the component from the local state
      setComponents(prevComponents =>
        prevComponents.filter(comp => comp.id !== component.id)
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Error deleting variant:', error);
      setError(error.response?.data?.message || 'Failed to delete variant');
    }
  };

  const handleConfirmDuplicate = async () => {
    if (!duplicateComponent || !duplicateName.trim()) return;

    try {
      const response = await axios.post('/api/home-customization/duplicate', {
        component_id: duplicateComponent.id,
        display_name: duplicateName
      });

      // Reload the component order from the database to get the new duplicate
      const orderResponse = await axios.get('/api/home-customization/component-order');
      if (orderResponse.data.components && orderResponse.data.components.length > 0) {
        const orderedComponents = orderResponse.data.components.map(componentData => {
          const baseComponent = homeComponents.find(comp => comp.id === componentData.id);
          if (baseComponent) {
            return {
              ...baseComponent,
              id: componentData.variant_name ? `${componentData.id}-${componentData.variant_name}` : componentData.id,
              name: componentData.display_name || baseComponent.name,
              displayName: componentData.display_name || baseComponent.name,
              variantName: componentData.variant_name,
              isOriginal: componentData.is_original,
              isVisible: componentData.is_visible
            };
          }
          return null;
        }).filter(Boolean);

        setComponents(orderedComponents);
      }

      setShowDuplicateModal(false);
      setDuplicateComponent(null);
      setDuplicateName('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error duplicating component:', err);
      setError('Failed to duplicate component');
    }
  };

  return (
    <>
      <Head title="Home Customization - Dashboard" />
      <style>{dropdownStyles}</style>
      <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Topbar onToggleSidebar={toggleSidebar} auth={auth} />

        <div className="main-content">
          <Container fluid>
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="d-flex align-items-center">
                      <h2 className="mb-1 me-2">Home Customization</h2>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => setShowInfoModal(true)}
                        className="p-1"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <RiIcons.RiInformationLine size={16} />
                      </Button>
                    </div>
                    <p className="mb-0 text-muted">Drag and drop components to reorder the home page layout</p>
                  </div>
                  <div className="gap-2 d-flex">
                    <Button variant="outline-secondary" onClick={handleReset}>
                      <RiIcons.RiRefreshLine />
                      Reset
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <RiIcons.RiSaveLine />
                          Save Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {showSuccess && (
              <Row className="mb-4">
                <Col>
                  <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
                    <RiIcons.RiCheckLine />
                    Component order saved successfully!
                  </Alert>
                </Col>
              </Row>
            )}

            {error && (
              <Row className="mb-4">
                <Col>
                  <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    <RiIcons.RiErrorWarningLine />
                    {error}
                  </Alert>
                </Col>
              </Row>
            )}

            <Row className="justify-content-center">
              <Col lg={8} xl={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Home Page Components</h5>
                    <small className="text-muted">Drag items to reorder them on the home page</small>
                  </Card.Header>
                  <Card.Body>
                    {isLoading ? (
                      <div className="py-4 text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Loading component order...</p>
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={components.map(c => c.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {components.map((component, index) => (
                            <SortableItem
                              key={component.id}
                              id={component.id}
                              component={component}
                              onEdit={handleEdit}
                              onToggleVisibility={handleToggleVisibility}
                              onDuplicate={handleDuplicate}
                              onDelete={handleDelete}
                              isVisible={component.isVisible !== false}
                              currentOrder={index + 1}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Duplicate Component Modal */}
      <Modal show={showDuplicateModal} onHide={() => setShowDuplicateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Duplicate Component</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Component Name</Form.Label>
              <Form.Control
                type="text"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                placeholder="Enter name for the duplicated component"
              />
            </Form.Group>
            <p className="text-muted small">
              This will create a copy of "{duplicateComponent?.name}" that you can customize independently.
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDuplicateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmDuplicate}
            disabled={!duplicateName.trim()}
          >
            <RiIcons.RiFileCopyLine />
            Duplicate
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Instructions Info Modal */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="mb-0 d-flex align-items-center">
              <RiIcons.RiInformationLine className="me-2" />
              Home Customization Instructions
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6 className="mb-3">How to Use:</h6>
            <div className="mb-3 d-flex align-items-center">
              <RiIcons.RiDragMoveLine size={20} className="text-muted" />
              <small className="text-muted ms-2">Drag components by the handle to reorder them on the home page</small>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <RiIcons.RiSaveLine size={20} className="text-primary" />
              <small className="text-muted ms-2">Click "Save Order" to apply changes to the live site</small>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <RiIcons.RiRefreshLine size={20} className="text-warning" />
              <small className="text-muted ms-2">Click "Reset" to restore the default component order</small>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <RiIcons.RiEyeLine size={20} className="text-info" />
              <small className="text-muted ms-2">Use the dropdown menu to hide/show components</small>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <RiIcons.RiFileCopyLine size={20} className="text-success" />
              <small className="text-muted ms-2">Duplicate components to create variants with different content</small>
            </div>
          </div>

          <hr />

          <div>
            <h6 className="mb-3">Current Component Order:</h6>
            <ol className="small text-muted">
              {components.map((component, index) => (
                <li key={component.id} className="mb-1">
                  <strong>{component.displayName || component.name}</strong>
                  {!component.isVisible && <span className="badge bg-secondary ms-2 small">Hidden</span>}
                  {component.variantName && <span className="badge bg-info ms-2 small">Variant</span>}
                </li>
              ))}
            </ol>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
