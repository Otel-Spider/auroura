import React from 'react';
import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Link, router } from '@inertiajs/react';
import * as RiIcons from 'react-icons/ri';
import axios from 'axios';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import StickyActionBar from '../../components/shared/StickyActionBar';
import DashboardFooter from '../../components/shared/DashboardFooter';
import { useHero } from '../../contexts/HeroContext';
import { getCSRFToken, refreshCSRFToken } from '../../utils/csrf';
import { toast } from 'react-toastify';
import '../../Components/assets/css/shared/StickyActionBar.css';

export default function Banner({ auth, variant = null }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(true);
  const [originalData, setOriginalData] = React.useState(null);
  const [hasUserEdited, setHasUserEdited] = React.useState(false); // Track if user actually edited
  const [isChipsExpanded, setIsChipsExpanded] = React.useState(false); // Track Feature Chips section state

  // Variant management state
  const [availableVariants, setAvailableVariants] = React.useState([]);
  const [selectedVariant, setSelectedVariant] = React.useState(variant);
  const [isLoadingVariants, setIsLoadingVariants] = React.useState(false);

  // Use HeroContext for state management
  const { heroData, setHeroData, loading, error, updateHeroField, toggleChip, updateChipLabel, addNewChip, removeChip, updateHeroData, setHeroDataFromResponse, uploadChipImages, renameBackgroundImage, saveDraftLocally, publishHeroData } = useHero();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Load available variants
  React.useEffect(() => {
    const loadVariants = async () => {
      setIsLoadingVariants(true);
      try {
        const response = await axios.get('/api/home-customization/component-order');
        if (response.data.components) {
          const heroVariants = response.data.components
            .filter(comp => comp.id === 'resort-hero')
            .map(comp => ({
              id: comp.variant_name || 'default',
              name: comp.display_name || (comp.variant_name ? 'Resort Hero Copy' : 'Main Resort Hero'),
              isOriginal: comp.is_original
            }));
          setAvailableVariants(heroVariants);

          // If no variant is selected, select the first one
          if (!selectedVariant && heroVariants.length > 0) {
            setSelectedVariant(heroVariants[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading variants:', err);
        toast.error('Failed to load hero variants');
      } finally {
        setIsLoadingVariants(false);
      }
    };

    loadVariants();
  }, []);

  // Load variant-specific data when variant changes
  React.useEffect(() => {
    if (selectedVariant && selectedVariant !== 'default') {
      loadVariantData(selectedVariant);
    } else if (selectedVariant === 'default') {
      loadDefaultData();
    }
    // If selectedVariant is null, let the HeroContext handle the initial load
  }, [selectedVariant]);

  // Load variant-specific data
  const loadVariantData = async (variantName) => {
    try {
      console.log('Loading variant data for:', variantName);
      // First try to load draft data
      const componentResponse = await axios.get('/api/home-customization/component-order');
      if (componentResponse.data.components) {
        const variantComponent = componentResponse.data.components.find(comp =>
          comp.id === 'resort-hero' && comp.variant_name === variantName
        );

        if (variantComponent && variantComponent.draft_data &&
            typeof variantComponent.draft_data === 'object' &&
            !Array.isArray(variantComponent.draft_data) &&
            Object.keys(variantComponent.draft_data).length > 0) {
          console.log('Found draft data for variant:', variantComponent.draft_data);
          // Use draft data if available
          const heroData = {
            title: variantComponent.draft_data.title,
            location: variantComponent.draft_data.location,
            stars: variantComponent.draft_data.stars,
            bgImageUrl: variantComponent.draft_data.bgImageUrl,
            bgImage: variantComponent.draft_data.bgImage,
            bgImageAlt: variantComponent.draft_data.bgImageAlt,
            bgImageName: variantComponent.draft_data.bgImageName,
            ratingScore: variantComponent.draft_data.ratingScore,
            ratingReviews: variantComponent.draft_data.ratingReviews,
            chips: variantComponent.draft_data.chips,
            chipImages: variantComponent.draft_data.chipImages || {}
          };

          console.log('Setting hero data from draft:', heroData);
          setHeroData(heroData);
          setOriginalData(JSON.parse(JSON.stringify(heroData)));
          return;
        } else {
          console.log('No valid draft data found, draft_data:', variantComponent?.draft_data);
        }
      }

      // Fallback to live data
      console.log('Fetching live data for variant:', variantName);
      const response = await axios.get(`/api/hero/variant/${variantName}`);
      console.log('Live variant data response:', response.data);

      if (response.data) {
        // Convert the API response to the format expected by the hero context
        const heroData = {
          title: response.data.title,
          location: response.data.location,
          stars: response.data.stars,
          bgImageUrl: response.data.bg_image_url || response.data.bgImageUrl,
          bgImage: response.data.bg_image || response.data.bgImage,
          bgImageAlt: response.data.bg_image_alt || response.data.bgImageAlt,
          bgImageName: response.data.bg_image_name || response.data.bgImageName,
          ratingScore: response.data.rating_score || response.data.ratingScore,
          ratingReviews: response.data.rating_reviews || response.data.ratingReviews,
          chips: response.data.chips,
          chipImages: response.data.chip_images || response.data.chipImages || {}
        };

        console.log('Converted hero data for variant:', heroData);
        console.log('Image data:', {
          bgImage: heroData.bgImage,
          bgImageUrl: heroData.bgImageUrl,
          hasBgImage: !!heroData.bgImage,
          hasBgImageUrl: !!heroData.bgImageUrl
        });

        // Set the hero data directly
        setHeroData(heroData);
        setOriginalData(JSON.parse(JSON.stringify(heroData)));
      }
    } catch (err) {
      console.error('Error loading variant data:', err);
      toast.error('Failed to load variant data');
    }
  };

  // Load default hero data
  const loadDefaultData = async () => {
    try {
      // First try to load draft data
      try {
        const componentResponse = await axios.get('/api/home-customization/component-order');
        if (componentResponse.data.components) {
          const defaultHero = componentResponse.data.components.find(comp =>
            comp.id === 'resort-hero' && !comp.variant_name
          );

          if (defaultHero && defaultHero.draft_data &&
              typeof defaultHero.draft_data === 'object' &&
              !Array.isArray(defaultHero.draft_data) &&
              Object.keys(defaultHero.draft_data).length > 0) {
            // Use draft data if available
            const heroData = {
              title: defaultHero.draft_data.title,
              location: defaultHero.draft_data.location,
              stars: defaultHero.draft_data.stars,
              bgImageUrl: defaultHero.draft_data.bgImageUrl,
              bgImage: defaultHero.draft_data.bgImage,
              bgImageAlt: defaultHero.draft_data.bgImageAlt,
              bgImageName: defaultHero.draft_data.bgImageName,
              ratingScore: defaultHero.draft_data.ratingScore,
              ratingReviews: defaultHero.draft_data.ratingReviews,
              chips: defaultHero.draft_data.chips,
              chipImages: defaultHero.draft_data.chipImages || {}
            };

            setHeroData(heroData);
            setOriginalData(JSON.parse(JSON.stringify(heroData)));
            return;
          } else if (defaultHero && defaultHero.component_data) {
            // Use component_data if no draft data
            const heroData = {
              title: defaultHero.component_data.title,
              location: defaultHero.component_data.location,
              stars: defaultHero.component_data.stars,
              bgImageUrl: defaultHero.component_data.bgImageUrl,
              bgImage: defaultHero.component_data.bgImage,
              bgImageAlt: defaultHero.component_data.bgImageAlt,
              bgImageName: defaultHero.component_data.bgImageName,
              ratingScore: defaultHero.component_data.ratingScore,
              ratingReviews: defaultHero.component_data.ratingReviews,
              chips: defaultHero.component_data.chips,
              chipImages: defaultHero.component_data.chipImages || {}
            };

            setHeroData(heroData);
            setOriginalData(JSON.parse(JSON.stringify(heroData)));
            return;
          }
        }
      } catch (componentErr) {
        console.log('No component data found, falling back to hero_settings');
      }

      // Fallback to hero_settings table
      const response = await axios.get('/api/hero/active');
      if (response.data) {
        // Convert the API response to the format expected by the hero context
        const heroData = {
          title: response.data.title,
          location: response.data.location,
          stars: response.data.stars,
          bgImageUrl: response.data.bg_image_url || response.data.bgImageUrl,
          bgImage: response.data.bg_image || response.data.bgImage,
          bgImageAlt: response.data.bg_image_alt || response.data.bgImageAlt,
          bgImageName: response.data.bg_image_name || response.data.bgImageName,
          ratingScore: response.data.rating_score || response.data.ratingScore,
          ratingReviews: response.data.rating_reviews || response.data.ratingReviews,
          chips: response.data.chips,
          chipImages: response.data.chip_images || response.data.chipImages || {}
        };

        // Set the hero data directly
        setHeroData(heroData);
        setOriginalData(JSON.parse(JSON.stringify(heroData)));
      }
    } catch (err) {
      console.error('Error loading default hero data:', err);
      toast.error('Failed to load default hero data');
    }
  };

  // Handle variant selection
  const handleVariantChange = async (variantId) => {
    setSelectedVariant(variantId);
    setHasChanges(false);
    setHasUserEdited(false);
    setOriginalData(null);

    // Load the data for the selected variant
    if (variantId && variantId !== 'default') {
      await loadVariantData(variantId);
    } else {
      // Load default hero data
      await loadDefaultData();
    }
  };

  // Store original data when loaded
  React.useEffect(() => {
    if (heroData && !originalData) {
      setOriginalData(JSON.parse(JSON.stringify(heroData)));
      setHasUserEdited(false); // Reset user edited flag when data loads
    }
  }, [heroData, originalData]);

  // Track changes only if user has actually edited
  React.useEffect(() => {
    if (originalData && heroData && hasUserEdited) {
      const hasChanged = JSON.stringify(originalData) !== JSON.stringify(heroData);
      setHasChanges(hasChanged);
    } else if (!hasUserEdited) {
      setHasChanges(false); // No changes if user hasn't edited
    }
  }, [heroData, originalData, hasUserEdited]);

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

  const handleInputChange = (field, value) => {
    updateHeroField(field, value);
    setHasUserEdited(true); // Mark that user has edited
  };

  const handleChipToggle = (chipKey) => {
    toggleChip(chipKey);
    setHasUserEdited(true); // Mark that user has edited
    setHasChanges(true); // Ensure save button is enabled
  };

  const handleChipLabelChange = (chipKey, newLabel) => {
    updateChipLabel(chipKey, newLabel);
    setHasUserEdited(true); // Mark that user has edited
    setHasChanges(true); // Ensure save button is enabled
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
      setHasUserEdited(true); // Mark that user has edited
      setHasChanges(true); // Ensure save button is enabled
    } catch (err) {
      console.error('Error uploading chip image:', err);
    }
  };

  const handleImageUpload = async (e) => {
    console.log('handleImageUpload called with event:', e);
    console.log('Event target files:', e.target.files);
    console.log('Files length:', e.target.files.length);

    const file = e.target.files[0];
    console.log('File selected:', file);
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

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
      console.log('Appending file to FormData:', file);
      formData.append('bg_image', file);
      console.log('FormData after appending file:', formData.has('bg_image'));

      // For image uploads, we only need to send the image and basic fields
      // The backend will merge with existing data
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
      // Don't send chips, chipImages, or other complex fields via FormData
      // The backend will preserve existing data and only update the image

      // Determine the correct endpoint and method based on selected variant
      // For variants, always use the draft endpoint for image uploads
      const endpoint = selectedVariant && selectedVariant !== 'default'
        ? `/api/hero/variant/${selectedVariant}/draft`
        : '/api/hero/update';

      const method = selectedVariant && selectedVariant !== 'default' ? 'post' : 'post'; // Use POST for draft endpoint

      console.log('Image upload details:', {
        selectedVariant,
        endpoint,
        method,
        file: file.name,
        fileSize: file.size
      });

      // Debug FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      console.log('Sending axios request:', {
        method,
        endpoint,
        hasFormData: !!formData,
        formDataSize: formData.get('bg_image') ? 'has file' : 'no file'
      });

      const response = await axios[method](endpoint, formData, {
        headers: {
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        }
      });

      console.log('Axios response received:', response.status, response.data);

      console.log('Image uploaded successfully:', response.data);

      // Update the hero context with the new data
      // Handle different response formats for original vs variant endpoints
      let responseData = null;
      if (selectedVariant && selectedVariant !== 'default') {
        // Variant endpoint returns data directly
        responseData = response.data.data || response.data;
      } else {
        // Original hero endpoint returns data in nested structure
        responseData = response.data.data;
      }

      if (responseData) {
        console.log('Updating hero context with:', responseData);

        // Convert response data to the format expected by the component
        const updatedHeroData = {
          ...heroData, // Keep existing data
          title: responseData.title || heroData.title,
          location: responseData.location || heroData.location,
          stars: responseData.stars || heroData.stars,
          bgImageUrl: responseData.bg_image_url || responseData.bgImageUrl || heroData.bgImageUrl,
          bgImage: responseData.bg_image || responseData.bgImage || heroData.bgImage,
          bgImageAlt: responseData.bg_image_alt || responseData.bgImageAlt || heroData.bgImageAlt,
          bgImageName: responseData.bg_image_name || responseData.bgImageName || heroData.bgImageName,
          ratingScore: responseData.rating_score || responseData.ratingScore || heroData.ratingScore,
          ratingReviews: responseData.rating_reviews || responseData.ratingReviews || heroData.ratingReviews,
          chips: responseData.chips || heroData.chips || [],
          chipImages: responseData.chip_images || responseData.chipImages || heroData.chipImages || {}
        };

        setHeroData(updatedHeroData);
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
            // Don't send chips in retry either
            // retryFormData.append('chips', JSON.stringify(heroData.chips || []));

            const retryResponse = await axios[method](endpoint, retryFormData, {
              headers: {
                'X-CSRF-TOKEN': newToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
              }
            });

            console.log('Image uploaded successfully on retry:', retryResponse.data);

            // Handle different response formats for original vs variant endpoints
            let retryResponseData = null;
            if (selectedVariant && selectedVariant !== 'default') {
              // Variant endpoint returns data directly
              retryResponseData = retryResponse.data.data || retryResponse.data;
            } else {
              // Original hero endpoint returns data in nested structure
              retryResponseData = retryResponse.data.data;
            }

            if (retryResponseData) {
              // Convert response data to the format expected by the component
              const updatedHeroData = {
                ...heroData, // Keep existing data
                title: retryResponseData.title || heroData.title,
                location: retryResponseData.location || heroData.location,
                stars: retryResponseData.stars || heroData.stars,
                bgImageUrl: retryResponseData.bg_image_url || retryResponseData.bgImageUrl || heroData.bgImageUrl,
                bgImage: retryResponseData.bg_image || retryResponseData.bgImage || heroData.bgImage,
                bgImageAlt: retryResponseData.bg_image_alt || retryResponseData.bgImageAlt || heroData.bgImageAlt,
                bgImageName: retryResponseData.bg_image_name || retryResponseData.bgImageName || heroData.bgImageName,
                ratingScore: retryResponseData.rating_score || retryResponseData.ratingScore || heroData.ratingScore,
                ratingReviews: retryResponseData.rating_reviews || retryResponseData.ratingReviews || heroData.ratingReviews,
                chips: retryResponseData.chips || heroData.chips || [],
                chipImages: retryResponseData.chip_images || retryResponseData.chipImages || heroData.chipImages || {}
              };

              setHeroData(updatedHeroData);
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
      // Ensure all required fields are present with fallbacks
      const completeHeroData = {
        ...heroData,
        title: heroData.title || "Rixos Sharm El Sheikh Adults Only 18+",
        location: heroData.location || "Sharm El Sheikh, Egypt",
        stars: heroData.stars || 5,
        ratingScore: heroData.ratingScore || "4.8/5",
        ratingReviews: heroData.ratingReviews || "900 reviews",
        bgImageUrl: heroData.bgImageUrl || null,
        bgImage: heroData.bgImage || null,
        bgImageAlt: heroData.bgImageAlt || "Resort Hero Background",
        bgImageName: heroData.bgImageName || "hero-background",
        chips: heroData.chips || [],
        chipImages: heroData.chipImages || {}
      };

      if (selectedVariant && selectedVariant !== 'default') {
        // Save variant-specific data as draft (don't make it live)
        const response = await axios.post(`/api/hero/variant/${selectedVariant}/draft`, completeHeroData);

        // Update heroData with the response data to ensure consistency
        if (response.data && response.data.data) {
          setHeroData(prevData => ({
            ...prevData,
            ...response.data.data
          }));
        }

        toast.success('Variant data saved as draft');
      } else {
        // Save default hero data as draft only (don't make it live)
        await axios.put('/api/home-customization/component-data', {
          component_id: 'resort-hero',
          variant_name: null,
          component_data: completeHeroData,
          is_draft: true
        });

        toast.success('Hero data saved as draft');
      }

      setOriginalData(JSON.parse(JSON.stringify(completeHeroData)));
      setHasChanges(false);
      setHasUserEdited(false); // Reset user edited flag after save
      setIsPublished(false);
      console.log('Hero data saved:', completeHeroData);

      // Save as draft - don't trigger frontend refresh
      toast.success('Changes saved as draft! Click Publish to make changes live.');
    } catch (err) {
      console.error('Error saving data:', err);
      toast.error('Failed to save data');
    }
  };

  const handlePublish = async () => {
    try {
      // Ensure all required fields are present with fallbacks
      const completeHeroData = {
        ...heroData,
        title: heroData.title || "Rixos Sharm El Sheikh Adults Only 18+",
        location: heroData.location || "Sharm El Sheikh, Egypt",
        stars: heroData.stars || 5,
        ratingScore: heroData.ratingScore || "4.8/5",
        ratingReviews: heroData.ratingReviews || "900 reviews",
        bgImageUrl: heroData.bgImageUrl || null,
        bgImage: heroData.bgImage || null,
        bgImageAlt: heroData.bgImageAlt || "Resort Hero Background",
        bgImageName: heroData.bgImageName || "hero-background",
        chips: heroData.chips || [],
        chipImages: heroData.chipImages || {}
      };

      if (selectedVariant && selectedVariant !== 'default') {
        // Publish variant-specific data
        await axios.put(`/api/hero/variant/${selectedVariant}`, completeHeroData);
        toast.success('Variant data published successfully');
      } else {
        // Publish default hero data to both hero_settings and component_data
        // First save to hero_settings table (existing functionality)
        await publishHeroData(completeHeroData);

        // Also save to component_data for consistency
        await axios.put('/api/home-customization/component-data', {
          component_id: 'resort-hero',
          variant_name: null,
          component_data: completeHeroData
        });

        toast.success('Hero data published successfully');
      }

      // Update state
      setIsPublished(true);
      setOriginalData(JSON.parse(JSON.stringify(completeHeroData)));
      setHasChanges(false);
      setHasUserEdited(false); // Reset user edited flag after publish

      console.log('Hero data published:', completeHeroData);

      // Trigger refresh of home page
      localStorage.setItem('hero-data-updated', Date.now().toString());
    } catch (err) {
      console.error('Error publishing hero data:', err);
      toast.error('Failed to publish hero data: ' + (err.response?.data?.message || err.message));
    }
  };


  const handleRenameFile = async () => {
    const newName = prompt('Enter new file name (without extension):',
      heroData.bgImage ? String(heroData.bgImage).split('/').pop().split('.')[0] : '');

    if (newName && newName.trim() !== '') {
      const cleanName = newName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      await renameBackgroundImage(cleanName);
    }
  };

  // Debug the loading condition
  console.log('Banner loading check:', {
    loading,
    hasHeroData: !!heroData,
    heroDataTitle: heroData?.title,
    willShowLoading: loading || !heroData || !heroData.title
  });

  // Show loading state if data is not ready
  if (loading || !heroData || !heroData.title) {
    return (
      <>
        <Head title="Home Banner" />
        <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          <Topbar onToggleSidebar={toggleSidebar} auth={auth} />
          <div className="main-content">
            <Container fluid>
              <Row className="mb-2">
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
              <Row className="mb-2">
                <Col xs={12}>
                  <div style={{
                    minHeight: '100vh',
                    backgroundColor: '#000000',
                    width: '100%'
                  }}>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Home Banner" />
      <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Topbar onToggleSidebar={toggleSidebar} auth={auth} />
        <StickyActionBar
          hasChanges={hasChanges}
          loading={loading}
          onSave={handleSave}
          onPublish={handlePublish}
          auth={auth}
        />

        <div className="main-content">
          <Container fluid>
            {/* Breadcrumb */}
            <Row className="mb-2">
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
            <Row className="mb-2">
              <Col xs={12}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="gap-2 mb-1 d-flex align-items-center">
                      <h5 className="mb-0 text-white">Home Banner</h5>
                      <Badge bg={isPublished ? "success" : hasChanges ? "danger" : "warning"} className="small">
                        {isPublished ? "Published" : hasChanges ? "Unsaved Changes" : "Draft"}
                      </Badge>
                    </div>
                    <p className="mb-0 text-white small">Manage your home banner settings and content</p>
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
                  <div className="gap-2 d-flex">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSave}
                      disabled={loading || !auth?.user || !hasChanges}
                      className="d-flex align-items-center"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span>Saving...</span>
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
                      disabled={loading || !auth?.user}
                      className="d-flex align-items-center"
                    >
                      <RiIcons.RiGlobalLine size={16} className="me-1" />
                      Publish
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Variant Selector */}
            {availableVariants.length > 1 && (
              <Row className="mb-4">
                <Col xs={12}>
                  <Card className="border-0 bg-dark">
                    <Card.Body className="py-3">
                      <div className="gap-3 d-flex align-items-center">
                        <label className="mb-0 text-white fw-medium">Edit Hero Section:</label>
                        <Form.Select
                          value={selectedVariant || 'default'}
                          onChange={(e) => handleVariantChange(e.target.value)}
                          className="text-white bg-dark border-secondary"
                          style={{ maxWidth: '300px' }}
                          disabled={isLoadingVariants}
                        >
                          {availableVariants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.name} {variant.isOriginal ? '(Main)' : '(Copy)'}
                            </option>
                          ))}
                        </Form.Select>
                        {isLoadingVariants && (
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </div>
                      <small className="mt-2 text-muted d-block">
                        Select which hero section you want to edit. Each section can have different content.
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Hero Settings */}
            <Row className="g-2">
              <Col xs={12} lg={8}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0 text-white">Hero Section Content</h6>
                  </Card.Header>
                  <Card.Body className="p-2">
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label className="text-white small">Resort Title</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              placeholder="Enter resort title"
                              value={heroData.title || ''}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              disabled={!auth?.user}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label className="text-white small">Location</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              placeholder="Enter location"
                              value={heroData.location || ''}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-2">
                            <Form.Label className="text-white">Star Rating</Form.Label>
                            <Form.Select
                              value={heroData.stars || 5}
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
                          <Form.Group className="mb-2">
                            <Form.Label className="text-white">Rating Score</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="4.8/5"
                              value={heroData.ratingScore || ''}
                              onChange={(e) => handleInputChange('ratingScore', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-2">
                            <Form.Label className="text-white">Reviews Text</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="900 reviews"
                              value={heroData.ratingReviews || ''}
                              onChange={(e) => handleInputChange('ratingReviews', e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-2">
                        <Form.Label className="text-white">Background Image</Form.Label>
                        <div className="mb-2">
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              console.log('File input onChange triggered:', e.target.files);
                              console.log('File input value:', e.target.value);
                              console.log('File input files length:', e.target.files.length);
                              if (e.target.files.length > 0) {
                                console.log('First file:', e.target.files[0]);
                              }
                              handleImageUpload(e);
                            }}
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
                            value={heroData.bgImageUrl || ''}
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
                                value={heroData.bgImageAlt || ''}
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
                                            File path: <code>/storage/{String(heroData.bgImage || '')}</code>
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
                  </Card.Body>
                </Card>

                {                /* Feature Chips Control */}
                <Card className="mt-2">
                  <Card.Header
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      cursor: 'pointer',
                      padding: isChipsExpanded ? '0.75rem 1rem' : '1rem 1.25rem',
                      transition: 'padding 0.3s ease'
                    }}
                    onClick={() => setIsChipsExpanded(!isChipsExpanded)}
                  >
                    <div className="d-flex align-items-center">
                      <h6
                        className="mb-0 text-white me-2"
                        style={{
                          fontSize: isChipsExpanded ? '0.875rem' : '1rem',
                          transition: 'font-size 0.3s ease'
                        }}
                      >
                        Feature Chips
                      </h6>
                      <RiIcons.RiArrowDownSLine
                        size={isChipsExpanded ? 16 : 18}
                        className="text-white"
                        style={{
                          transform: isChipsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease, font-size 0.3s ease'
                        }}
                      />
                    </div>
                    {isChipsExpanded && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card header click
                          addNewChip();
                          setHasUserEdited(true); // Mark that user has edited
                          setHasChanges(true); // Ensure save button is enabled
                        }}
                        disabled={!auth?.user}
                        className="d-flex align-items-center"
                      >
                        <RiIcons.RiAddLine size={14} className="me-1" />
                        Add
                      </Button>
                    )}
                  </Card.Header>
                  {isChipsExpanded && (
                  <Card.Body>
                            <Row>
                              {(heroData.chips || []).map((chip) => (
                                <Col md={6} lg={4} key={chip.key} className="mb-2">
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
                                      onClick={() => {
                                        removeChip(chip.key);
                                        setHasUserEdited(true); // Mark that user has edited
                                        setHasChanges(true); // Ensure save button is enabled
                                      }}
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
                  </Card.Body>
                  )}
                </Card>
              </Col>

              <Col xs={12} lg={4}>
                <Card>
                  <Card.Header>
                    <h6 className="mb-0 text-white">Hero Preview</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="hero-preview" style={{ height: '300px', overflow: 'hidden', borderRadius: '8px' }}>
                            <div
                              style={{
                                backgroundImage: `url(${heroData.bgImage ? `/storage/${String(heroData.bgImage)}` : heroData.bgImageUrl})`,
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
                              <span key={index} style={{ color: index < heroData.stars ? '#D1BB4F' : 'rgba(255,255,255,0.3)' }}>
                                ★
                              </span>
                            ))}
                          </div>

                          {/* Location */}
                          <p className="mb-2 small">📍 {heroData.location}</p>

                          {/* Feature Chips */}
                          <div className="flex-wrap gap-1 mb-2 d-flex justify-content-center">
                            {(heroData.chips || []).filter(chip => chip.enabled).slice(0, 4).map((chip) => (
                              <Badge key={chip.key} bg="light" text="dark" className="small">
                                {chip.label}
                              </Badge>
                            ))}
                            {(heroData.chips || []).filter(chip => chip.enabled).length > 4 && (
                              <Badge bg="light" text="dark" className="small">
                                +{(heroData.chips || []).filter(chip => chip.enabled).length - 4} more
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
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}
